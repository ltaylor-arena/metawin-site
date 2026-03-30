#!/usr/bin/env node

/**
 * add-screenshots.js
 *
 * Uploads game screenshots to Sanity and embeds them into the game document:
 * - Adds all images to the `screenshots[]` slideshow array
 * - Inserts inline images into gameRichText content blocks with auto-generated captions
 *
 * Usage:
 *   node scripts/add-screenshots.js <game-slug> [--dry-run]
 *
 * Images are read from the configured IMAGES_DIR, matching the pattern: <game-slug>-1.png, <game-slug>-2.png, etc.
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

// ─── Find images for a game slug ─────────────────────────────────────────────

function findImages(slug) {
  const files = fs.readdirSync(IMAGES_DIR);
  const pattern = new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)\\.(png|jpg|jpeg|webp)$`, "i");
  return files
    .filter((f) => pattern.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(pattern)[1]);
      const numB = parseInt(b.match(pattern)[1]);
      return numA - numB;
    })
    .map((f) => path.join(IMAGES_DIR, f));
}

// ─── Upload image to Sanity ──────────────────────────────────────────────────

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const asset = await sanity.assets.upload("image", buffer, { filename });
  return asset._id;
}

// ─── Find the game in Sanity ─────────────────────────────────────────────────

async function findGameBySlug(slug) {
  // Try matching by slug first
  const bySlug = await sanity.fetch(
    `*[_type == "game" && slug.current == $slug][0]{ _id, title, slug }`,
    { slug }
  );
  if (bySlug) return bySlug;

  // Fuzzy match on title derived from slug
  const titleGuess = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  console.log(`   No slug match, searching by title: "${titleGuess}"...`);

  const byTitle = await sanity.fetch(
    `*[_type == "game" && lower(title) == $title][0]{ _id, title, slug }`,
    { title: titleGuess.toLowerCase() }
  );
  if (byTitle) return byTitle;

  // Try with "Slot" suffix
  const byTitleSlot = await sanity.fetch(
    `*[_type == "game" && lower(title) == $title][0]{ _id, title, slug }`,
    { title: (titleGuess + " Slot").toLowerCase() }
  );
  if (byTitleSlot) return byTitleSlot;

  // Try stripping common suffixes (slot, crash, game) from the slug
  const suffixes = ["slot", "crash", "game"];
  for (const suffix of suffixes) {
    if (slug.endsWith(`-${suffix}`)) {
      const stripped = slug.replace(new RegExp(`-${suffix}$`), "");
      const strippedTitle = stripped
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      console.log(`   Trying stripped title: "${strippedTitle}"...`);
      const byStripped = await sanity.fetch(
        `*[_type == "game" && lower(title) == $title][0]{ _id, title, slug }`,
        { title: strippedTitle.toLowerCase() }
      );
      if (byStripped) return byStripped;
    }
  }

  return null;
}

// ─── Determine which sections get inline images ──────────────────────────────

function distributeImages(content, assetRefs, gameTitle) {
  // Eligible sections for inline images (in order)
  const eligibleSections = ["Introduction", "How to Play", "Bonus Features", "Symbols and Paytable", "Tips"];

  // Find indices of eligible gameRichText blocks
  const sectionIndices = [];
  content.forEach((block, idx) => {
    if (
      block._type === "gameRichText" &&
      eligibleSections.includes(block.tocTitle)
    ) {
      sectionIndices.push({ idx, tocTitle: block.tocTitle });
    }
  });

  // Distribute images: max 2 inline images total (1 per section, capped at 2 sections)
  const assignments = new Map(); // sectionIdx -> [assetRef]
  const inlineCount = Math.min(assetRefs.length, sectionIndices.length, 2);
  for (let i = 0; i < inlineCount; i++) {
    assignments.set(sectionIndices[i].idx, [assetRefs[i]]);
  }

  return { assignments, sectionIndices };
}

// ─── Generate a contextual caption ───────────────────────────────────────────

function generateCaption(gameTitle, tocTitle, imageIndex, totalInSection) {
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

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const slug = process.argv.find(
    (arg) => !arg.startsWith("-") && arg !== process.argv[0] && arg !== process.argv[1]
  );

  if (!slug) {
    console.error("Usage: node scripts/add-screenshots.js <game-slug> [--dry-run]");
    process.exit(1);
  }

  const required = ["SANITY_PROJECT_ID", "SANITY_TOKEN"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`❌ Missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  // Find images
  const imagePaths = findImages(slug);
  if (imagePaths.length === 0) {
    console.error(`❌ No images found for slug "${slug}" in ${IMAGES_DIR}`);
    process.exit(1);
  }
  console.log(`\n📸 Found ${imagePaths.length} images for "${slug}":`);
  imagePaths.forEach((p) => console.log(`   ${path.basename(p)}`));

  // Find game
  const game = await findGameBySlug(slug);
  if (!game) {
    console.error(`\n❌ No matching game in Sanity for slug "${slug}".`);
    process.exit(1);
  }
  console.log(`✅ Game: "${game.title}" (${game._id})`);

  // Fetch full content
  const doc = await sanity.fetch(`*[_id == $id][0]{ content, screenshots }`, {
    id: game._id,
  });

  if (DRY_RUN) {
    console.log(`\n🏜️  DRY RUN — would upload ${imagePaths.length} images`);
    const { assignments, sectionIndices } = distributeImages(
      doc.content,
      imagePaths.map((_, i) => `placeholder-${i}`),
      game.title
    );
    console.log(`   Slideshow: ${imagePaths.length} images`);
    console.log(`   Inline distribution:`);
    for (const [idx, refs] of assignments) {
      const section = doc.content[idx];
      refs.forEach((_, i) => {
        const caption = generateCaption(
          game.title,
          section.tocTitle,
          i,
          refs.length
        );
        console.log(`     ${section.tocTitle}: "${caption}"`);
      });
    }
    return;
  }

  // Upload images
  console.log(`\n📤 Uploading ${imagePaths.length} images...`);
  const assetIds = [];
  for (const imgPath of imagePaths) {
    const assetId = await uploadImage(imgPath);
    console.log(`   ✅ ${path.basename(imgPath)} → ${assetId}`);
    assetIds.push(assetId);
  }

  // Build screenshots array
  const screenshots = assetIds.map((id, i) => ({
    _type: "image",
    _key: generateKey(),
    alt: `${game.title} Screenshot`,
    asset: { _type: "reference", _ref: id },
  }));

  // Distribute inline images
  const { assignments } = distributeImages(doc.content, assetIds, game.title);

  const newContent = [];
  for (let i = 0; i < doc.content.length; i++) {
    const block = doc.content[i];
    newContent.push(block);

    if (assignments.has(i) && block._type === "gameRichText") {
      // Insert inline images at the end of the block's content array
      const refs = assignments.get(i);
      const sectionImageCount = {};

      for (const assetId of refs) {
        const count = sectionImageCount[block.tocTitle] || 0;
        const caption = generateCaption(
          game.title,
          block.tocTitle,
          count,
          refs.length
        );
        sectionImageCount[block.tocTitle] = count + 1;

        block.content.push({
          _type: "image",
          _key: generateKey(),
          alt: `${game.title} Screenshot`,
          caption: caption,
          asset: { _type: "reference", _ref: assetId },
        });
      }
    }
  }

  // Patch
  console.log(`\n📝 Patching ${game._id}...`);
  await sanity
    .patch(game._id)
    .set({
      content: newContent,
      screenshots: [...(doc.screenshots || []), ...screenshots],
    })
    .commit();

  console.log(`✅ Done — ${assetIds.length} images uploaded and embedded`);
  console.log(`   Slideshow: ${screenshots.length} images added`);
  console.log(
    `   Inline: distributed across ${assignments.size} content sections`
  );
  console.log("");
}

main();
