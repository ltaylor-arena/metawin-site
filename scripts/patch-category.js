#!/usr/bin/env node

/**
 * patch-category.js
 *
 * Patches an existing Sanity category document with structured content JSON.
 * Similar to patch-game.js but for category pages (Slots, Crash, Plinko, etc.)
 *
 * Usage:
 *   node scripts/patch-category.js <json-file> [--dry-run]
 *
 * The JSON file should contain:
 *   - slug: category slug for matching (e.g. "slots", "crash")
 *   - h1: page heading
 *   - description: intro text below heading
 *   - seo: { metaTitle, metaDescription, hideKicker }
 *   - content: array of content blocks (gameRichText, gameTable, gameAuthorThoughts)
 *   - faq: array of FAQ items
 *
 * Env vars required:
 *   SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");
const crypto = require("crypto");

// ─── Config ──────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");

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

// ─── Author config ───────────────────────────────────────────────────────────

const AUTHORS = {
  "424e7aad-8adc-41f7-8b8f-bc669daffdad": "Jeffrey Gynn",
  "4f774f93-f0e7-430f-99c8-5813744e4b4d": "Ziv Chen",
  "87f9e20f-d506-4bd3-b70a-51c2cb888196": "Luke Jones",
};
const AUTHOR_IDS = Object.keys(AUTHORS);

// ─── Find category by slug ───────────────────────────────────────────────────

async function findCategory(slug) {
  console.log(`🔎 Searching for category slug "${slug}"...`);

  const match = await sanity.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ _id, title, slug }`,
    { slug }
  );

  if (match) {
    console.log(`✅ Found: "${match.title}" (${match._id})`);
    return match;
  }

  // Show available categories
  const all = await sanity.fetch(
    `*[_type == "category"]{ title, slug } | order(title asc)`
  );
  console.log(`❌ No category with slug "${slug}". Available:`);
  all.forEach((c) => console.log(`   ${c.slug?.current} — ${c.title}`));
  return null;
}

// ─── Build patch ─────────────────────────────────────────────────────────────

function buildPatch(data) {
  const patch = {};

  // H1 and description
  if (data.h1) patch.h1 = data.h1;
  if (data.description) patch.description = data.description;

  // SEO
  if (data.seo) {
    patch.seo = {
      _type: "seo",
    };
    if (data.seo.metaTitle) patch.seo.metaTitle = data.seo.metaTitle;
    if (data.seo.metaDescription) patch.seo.metaDescription = data.seo.metaDescription;
    patch.seo.hideKicker = data.seo.hideKicker ?? false;
  }

  // Content blocks
  if (data.content && Array.isArray(data.content)) {
    patch.content = data.content.map((block) => ({
      ...block,
      _key: block._key || generateKey(),
    }));
  }

  // FAQ
  if (data.faq && Array.isArray(data.faq)) {
    patch.faq = data.faq.map((item) => ({
      ...item,
      _type: item._type || "faqItem",
      _key: item._key || generateKey(),
    }));
  }

  // Author, dates, showAuthorInfo
  patch.author = { _type: "reference", _ref: data._authorRef };
  patch.publishedAt = data._publishedAt;
  patch.updatedAt = data._publishedAt;
  patch.showAuthorInfo = true;

  return patch;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const jsonPath = process.argv.find((arg) => arg.endsWith(".json"));

  if (!jsonPath) {
    console.error("Usage: node scripts/patch-category.js <json-file> [--dry-run]");
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

    if (!data.slug) {
      console.error("❌ JSON must include a 'slug' field for matching.");
      process.exit(1);
    }

    console.log(`\n📄 Category: ${data.slug}`);
    console.log(`   H1: ${data.h1 || "(none)"}`);
    console.log(`   Content blocks: ${data.content?.length || 0}`);
    console.log(`   FAQ items: ${data.faq?.length || 0}`);

    // Match
    const match = await findCategory(data.slug);
    if (!match) {
      process.exit(1);
    }

    // Lock in author + date (persists across dry-run → live run)
    if (!data._authorRef) {
      data._authorRef = AUTHOR_IDS[Math.floor(Math.random() * AUTHOR_IDS.length)];
      data._publishedAt = new Date().toISOString();
      fs.writeFileSync(absPath, JSON.stringify(data, null, 2));
    }

    // Build patch
    const patch = buildPatch(data);

    if (DRY_RUN) {
      const preview = JSON.stringify(patch, null, 2);
      const outPath = absPath.replace(".json", ".dry-run.json");
      fs.writeFileSync(outPath, preview);
      console.log(`\n🏜️  DRY RUN — patch written to ${outPath}`);
      console.log(`   Content blocks: ${patch.content?.length || 0}`);
      console.log(`   FAQ items: ${patch.faq?.length || 0}`);
      console.log(`   Author: ${AUTHORS[patch.author._ref]} | Published: ${patch.publishedAt.split("T")[0]}`);
    } else {
      console.log(`\n📝 Patching ${match._id}...`);
      await sanity.patch(match._id).set(patch).commit();
      console.log(`✅ Done: ${match._id}`);
      console.log(`   Author: ${AUTHORS[patch.author._ref]} | Published: ${patch.publishedAt.split("T")[0]}`);
    }

    console.log("");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
