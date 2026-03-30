#!/usr/bin/env node

/**
 * patch-game.js
 *
 * Patches an existing Sanity game document with structured content JSON
 * produced by Claude Code from a writer's .docx file. Also uploads and
 * embeds screenshots if found in the images directory.
 *
 * Usage:
 *   node scripts/patch-game.js <json-file> [--dry-run]
 *
 * The JSON file should be produced by Claude Code following GAME_IMPORT.md.
 * Screenshots are auto-detected from IMAGES_DIR matching the game's slug.
 *
 * Env vars required:
 *   SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN
 *
 * Optional env var:
 *   IMAGES_DIR (defaults to C:\Users\lukas\OneDrive\SEO Briefs\Images)
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");
const crypto = require("crypto");

// ─── Config ──────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");
const IMAGES_DIR =
  process.env.IMAGES_DIR ||
  path.join("C:", "Users", "lukas", "OneDrive", "SEO Briefs", "Images");

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function generateKey() {
  return crypto.randomBytes(4).toString("hex");
}

// ─── Fuzzy match game title to existing Sanity document ──────────────────────

async function findMatchingGame(title) {
  console.log(`🔎 Searching Sanity for "${title}"...`);

  // Exact match first
  const exact = await sanity.fetch(
    `*[_type == "game" && lower(title) == $title][0]{ _id, title, slug }`,
    { title: title.toLowerCase() }
  );

  if (exact) {
    console.log(`✅ Exact match: "${exact.title}" (${exact._id})`);
    return exact;
  }

  // Fuzzy: Dice coefficient on bigrams
  const allGames = await sanity.fetch(
    `*[_type == "game"]{ _id, title, slug } | order(title asc)`
  );

  const normalize = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();

  const bigrams = (str) => {
    const set = new Set();
    for (let i = 0; i < str.length - 1; i++) set.add(str.substring(i, i + 2));
    return set;
  };

  const target = normalize(title);
  let bestMatch = null;
  let bestScore = 0;

  for (const game of allGames) {
    const a = bigrams(target);
    const b = bigrams(normalize(game.title));
    const intersection = new Set([...a].filter((x) => b.has(x)));
    const score = a.size + b.size > 0 ? (2 * intersection.size) / (a.size + b.size) : 0;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = game;
    }
  }

  if (bestScore >= 0.6) {
    console.log(`🔶 Fuzzy match (${(bestScore * 100).toFixed(0)}%): "${bestMatch.title}" (${bestMatch._id})`);
    return bestMatch;
  }

  // Show top 5 closest for debugging
  const scored = allGames.map((g) => {
    const a = bigrams(target);
    const b = bigrams(normalize(g.title));
    const intersection = new Set([...a].filter((x) => b.has(x)));
    return { title: g.title, score: a.size + b.size > 0 ? (2 * intersection.size) / (a.size + b.size) : 0 };
  });
  scored.sort((a, b) => b.score - a.score);
  console.log(`❌ No match found (threshold: 60%). Closest candidates:`);
  scored.slice(0, 5).forEach((s) => console.log(`   ${(s.score * 100).toFixed(0)}% — ${s.title}`));

  return null;
}

// ─── Screenshot helpers ──────────────────────────────────────────────────────

function findImages(slug) {
  if (!fs.existsSync(IMAGES_DIR)) return [];
  const files = fs.readdirSync(IMAGES_DIR);
  const pattern = new RegExp(
    `^${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)\\.(png|jpg|jpeg|webp)$`,
    "i"
  );
  return files
    .filter((f) => pattern.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(pattern)[1]);
      const numB = parseInt(b.match(pattern)[1]);
      return numA - numB;
    })
    .map((f) => path.join(IMAGES_DIR, f));
}

function guessImageSlug(gameTitle, sanitySlug) {
  // Try sanity slug first, then derive from title
  const candidates = [];
  if (sanitySlug) candidates.push(sanitySlug);
  candidates.push(
    gameTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
  // Also try with common suffixes
  const base = candidates[candidates.length - 1];
  candidates.push(`${base}-slot`, `${base}-crash`, `${base}-game`);

  for (const slug of candidates) {
    const imgs = findImages(slug);
    if (imgs.length > 0) return { slug, images: imgs };
  }
  return { slug: null, images: [] };
}

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const asset = await sanity.assets.upload("image", buffer, { filename });
  return asset._id;
}

function generateCaption(gameTitle, tocTitle, imageIndex) {
  const captions = {
    Introduction: [
      `${gameTitle} delivers an immersive gameplay experience from the very first spin.`,
      `The visual design of ${gameTitle} sets the scene for an engaging session.`,
      `${gameTitle} combines striking visuals with smooth performance.`,
    ],
    "How to Play": [
      `Getting started with ${gameTitle} is straightforward. Set your stake and spin.`,
      `The intuitive interface makes ${gameTitle} easy to pick up for new players.`,
      `${gameTitle} offers flexible betting options to suit all bankroll sizes.`,
    ],
    "Bonus Features": [
      `The bonus features in ${gameTitle} are where the biggest wins can be found.`,
      `${gameTitle}'s bonus round adds an exciting layer of gameplay.`,
      `Free Spins and Multipliers can significantly boost your winnings in ${gameTitle}.`,
    ],
    "Symbols and Paytable": [
      `${gameTitle} features a range of symbols with varying payout values.`,
      `The paytable in ${gameTitle} rewards higher-value symbol combinations generously.`,
    ],
    Tips: [
      `Smart bankroll management is key to getting the most out of ${gameTitle}.`,
      `Patience and discipline will serve you well when playing ${gameTitle}.`,
    ],
  };

  const pool = captions[tocTitle] || [`A screenshot from ${gameTitle}.`];
  return pool[imageIndex % pool.length];
}

function embedScreenshots(contentBlocks, assetIds, gameTitle) {
  const eligibleSections = [
    "Introduction",
    "How to Play",
    "Bonus Features",
    "Symbols and Paytable",
    "Tips",
  ];

  // Find eligible sections
  const sectionIndices = [];
  contentBlocks.forEach((block, idx) => {
    if (
      block._type === "gameRichText" &&
      eligibleSections.includes(block.tocTitle)
    ) {
      sectionIndices.push({ idx, tocTitle: block.tocTitle });
    }
  });

  // Max 2 inline images total (1 per section, capped at 2 sections)
  const inlineCount = Math.min(assetIds.length, sectionIndices.length, 2);

  for (let i = 0; i < inlineCount; i++) {
    const section = sectionIndices[i];
    const block = contentBlocks[section.idx];
    const caption = generateCaption(gameTitle, section.tocTitle, 0);

    block.content.push({
      _type: "image",
      _key: generateKey(),
      alt: `${gameTitle} Screenshot`,
      caption: caption,
      asset: { _type: "reference", _ref: assetIds[i] },
    });
  }

  // Build slideshow array (all images)
  const screenshots = assetIds.map((id) => ({
    _type: "image",
    _key: generateKey(),
    alt: `${gameTitle} Screenshot`,
    asset: { _type: "reference", _ref: id },
  }));

  return { contentBlocks, screenshots, inlineCount };
}

// ─── Build the Sanity patch from structured JSON ─────────────────────────────

function buildPatch(data) {
  const patch = {};

  // Structured fields
  const fields = [
    "rtp", "volatility", "maxWin", "minBet", "maxBet", "paylines",
    "reels", "hasFreeSpins", "hasBonusFeature", "hasAutoplay",
    "releaseDate", "provider",
  ];

  for (const field of fields) {
    if (data[field] != null) patch[field] = data[field];
  }

  // Content blocks — ensure _keys exist
  if (data.content && Array.isArray(data.content)) {
    patch.content = data.content.map((block) => ({
      ...block,
      _key: block._key || generateKey(),
    }));
  }

  // SEO
  if (data.seo) {
    patch.seo = {};
    if (data.seo.metaTitle) patch.seo.metaTitle = data.seo.metaTitle;
    if (data.seo.metaDescription) patch.seo.metaDescription = data.seo.metaDescription;
    patch.seo.hideKicker = true;
  }

  // Author, dates, showAuthorInfo — set externally via data._authorRef
  patch.author = { _type: "reference", _ref: data._authorRef };
  patch.publishedAt = data._publishedAt;
  patch.updatedAt = data._publishedAt;
  patch.showAuthorInfo = true;

  // FAQ
  if (data.faq && Array.isArray(data.faq)) {
    patch.faq = data.faq.map((item) => ({
      ...item,
      _type: item._type || "faqItem",
      _key: item._key || generateKey(),
    }));
  }

  return patch;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const jsonPath = process.argv.find((arg) => arg.endsWith(".json"));

  if (!jsonPath) {
    console.error("Usage: node scripts/patch-game.js <json-file> [--dry-run]");
    console.error("");
    console.error("The JSON file should contain the structured game data produced by Claude Code.");
    console.error("See GAME_IMPORT.md for the full workflow.");
    process.exit(1);
  }

  const required = ["SANITY_PROJECT_ID", "SANITY_TOKEN"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  const absPath = path.resolve(jsonPath);
  if (!fs.existsSync(absPath)) {
    console.error(`❌ File not found: ${absPath}`);
    process.exit(1);
  }

  try {
    const data = JSON.parse(fs.readFileSync(absPath, "utf-8"));

    if (!data.title) {
      console.error("❌ JSON must include a 'title' field for matching.");
      process.exit(1);
    }

    console.log(`\n📄 Game: ${data.title}`);
    console.log(`   Content blocks: ${data.content?.length || 0}`);
    console.log(`   FAQ items: ${data.faq?.length || 0}`);

    // Match
    const match = await findMatchingGame(data.title);
    if (!match) {
      console.error("\n❌ No matching game in Sanity. Create the document first or check the title.");
      process.exit(1);
    }

    // Lock in author + date (persists across dry-run → live run via the JSON file)
    const AUTHORS = {
      "424e7aad-8adc-41f7-8b8f-bc669daffdad": "Jeffrey Gynn",
      "4f774f93-f0e7-430f-99c8-5813744e4b4d": "Ziv Chen",
      "87f9e20f-d506-4bd3-b70a-51c2cb888196": "Luke Jones",
    };
    const AUTHOR_IDS = Object.keys(AUTHORS);

    if (!data._authorRef) {
      data._authorRef = AUTHOR_IDS[Math.floor(Math.random() * AUTHOR_IDS.length)];
      data._publishedAt = new Date().toISOString();
      // Write back to JSON so the live run uses the same choices
      fs.writeFileSync(absPath, JSON.stringify(data, null, 2));
    }

    // Build patch
    const patch = buildPatch(data);

    // Find screenshots
    const { slug: imageSlug, images: imagePaths } = guessImageSlug(
      match.title,
      match.slug?.current
    );

    if (imagePaths.length > 0) {
      console.log(`\n📸 Found ${imagePaths.length} screenshots (slug: "${imageSlug}"):`);
      imagePaths.forEach((p) => console.log(`   ${path.basename(p)}`));
    } else {
      console.log(`\n📸 No screenshots found in ${IMAGES_DIR}`);
    }

    // Apply
    if (DRY_RUN) {
      const preview = JSON.stringify(patch, null, 2);
      const outPath = absPath.replace(".json", ".dry-run.json");
      fs.writeFileSync(outPath, preview);
      console.log(`\n🏜️  DRY RUN — patch written to ${outPath}`);
      console.log(`   Content blocks: ${patch.content?.length || 0}`);
      console.log(`   FAQ items: ${patch.faq?.length || 0}`);
      console.log(`   Fields: ${Object.keys(patch).filter((k) => k !== "content" && k !== "faq").join(", ") || "none"}`);
      console.log(`   Author: ${AUTHORS[patch.author._ref]} | Published: ${patch.publishedAt.split("T")[0]}`);
      if (imagePaths.length > 0) {
        console.log(`   Screenshots: ${imagePaths.length} would be uploaded`);
        // Show inline distribution preview
        const eligibleSections = ["Introduction", "How to Play", "Bonus Features", "Symbols and Paytable", "Tips"];
        const sections = (patch.content || []).filter(
          (b) => b._type === "gameRichText" && eligibleSections.includes(b.tocTitle)
        );
        const inlineCount = Math.min(imagePaths.length, sections.length, 2);
        console.log(`   Inline images: ${inlineCount} (1 per section, max 2)`);
        for (let i = 0; i < inlineCount; i++) {
          const caption = generateCaption(match.title, sections[i].tocTitle, 0);
          console.log(`     ${sections[i].tocTitle}: "${caption}"`);
        }
      }
    } else {
      // Upload screenshots if found
      let screenshotsPatch = null;
      if (imagePaths.length > 0) {
        console.log(`\n📤 Uploading ${imagePaths.length} screenshots...`);
        const assetIds = [];
        for (const imgPath of imagePaths) {
          const assetId = await uploadImage(imgPath);
          console.log(`   ✅ ${path.basename(imgPath)} → ${assetId}`);
          assetIds.push(assetId);
        }

        const result = embedScreenshots(patch.content, assetIds, match.title);
        patch.content = result.contentBlocks;
        patch.screenshots = result.screenshots;
        console.log(`   Slideshow: ${result.screenshots.length} images`);
        console.log(`   Inline: ${result.inlineCount} images embedded`);
      }

      console.log(`\n📝 Patching ${match._id}...`);
      const result = await sanity.patch(match._id).set(patch).commit();
      console.log(`✅ Done: ${result._id}`);
    }

    console.log("");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
