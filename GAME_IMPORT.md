# Game Review Import Guide

This document describes how to import a writer's .docx game review into an existing Sanity game document using Claude Code.

## Prerequisites

- `pandoc` installed (`brew install pandoc`)
- `@sanity/client` installed (`npm install @sanity/client`)
- Env vars set: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN`

## Quick Start

Tell Claude Code:

```
Import the game review from ./reviews/All-About-The-Fish.docx
```

Claude Code will handle extraction, parsing, enrichment, and patching.

---

## Workflow (what Claude Code should do)

### Step 1: Extract markdown

```bash
pandoc "./review.docx" -t markdown --wrap=none -o /tmp/review.md
```

### Step 2: Parse the markdown into structured JSON

The writer's docs always follow this section order. Sections are NOT marked with proper headings — they appear as plain text paragraphs. Detect them by matching these patterns:

| Order | Section | Detection Pattern | Maps To |
|-------|---------|-------------------|---------|
| 1 | Title | First line | `title` field |
| 2 | Summary | First paragraph after title | `gameQuickSummary` block |
| 3 | Introduction | "[Game] Introduction" line | `gameRichText` (tocTitle: "Introduction") |
| 4 | How to Play | "How to Play [Game]" line | `gameRichText` (tocTitle: "How to Play") |
| 5 | Bonus Features | "Bonus Features" line | `gameRichText` (tocTitle: "Bonus Features") |
| 6 | Symbols & Paytable | "Symbols and Paytable" line | `gameTable` block with H2 heading + descriptive text in `introText`, NOT a separate `gameRichText` |
| 7 | Tips | "Tips for Playing" line | `gameRichText` (tocTitle: "Tips") |
| 8 | Pros and Cons | "Pros and Cons" line | `gameProsAndCons` block |
| 9 | Comparison | "[Game] vs [Competitor]" line | `gameTable` with H2 heading + intro paragraph in `introText` |
| 10 | FAQ | "FAQ" line | `faq[]` array |

### Step 3: Enrich game details via web search

Search the web for the game title + provider to fill in structured fields not mentioned in the review:

- `minBet`, `maxBet` (string, e.g. "$0.20")
- `rtp` (number, e.g. 96.40)
- `volatility` (one of: "low", "low-medium", "medium", "medium-high", "high")
- `reels` (number)
- `paylines` (string, e.g. "243", "Megaways")
- `maxWin` (string, e.g. "10,000x")
- `hasFreeSpins`, `hasBonusFeature`, `hasAutoplay` (boolean)
- `releaseDate` (string, "YYYY-MM-DD" format)
- `provider` (string)

Values found in the review text take priority over web search results. For MetaWin Originals / Gladiator games, public data may be limited — skip what you can't find.

### Step 3b: Extract author quotes

Select 2 salient sentences from the review to use as `gameAuthorThoughts` blocks. These are displayed as italicized pull-quotes on the page.

**Selection criteria:**
- Pick sentences that work as standalone highlights — opinions, key selling points, or noteworthy facts
- Prefer sentences containing evaluative language ("impressive", "unique", "key feature", "best thing", "worth noting", etc.)
- One quote should come from the **Introduction** section
- The second quote should come from a different section — **Bonus Features**, **How to Play**, or **Tips** (whichever has the most compelling sentence)

**Placement in the content array:**
- Insert each `gameAuthorThoughts` block **immediately after** the section it was pulled from
- Example order: gameQuickSummary → gameRichText (Introduction) → **gameAuthorThoughts** → gameRichText (How to Play) → **gameAuthorThoughts** → ...

**Format:**
```json
{
  "_type": "gameAuthorThoughts",
  "_key": "ab12cd34",
  "content": [
    {
      "_type": "block",
      "_key": "ef56gh78",
      "style": "normal",
      "markDefs": [],
      "children": [
        { "_type": "span", "_key": "ij90kl12", "text": "The salient sentence here.", "marks": [] }
      ]
    }
  ]
}
```

### Step 3c: Generate SEO metadata

Generate `metaTitle` and `metaDescription` following these guidelines derived from existing game pages:

**Meta Title** (max 60 chars, " | MetaWin Casino" is appended automatically):
- Format: `{Game Name} Slot | Play with BTC, ETH+ more at MetaWin`
- For exclusive/in-house games (MetaWin Studios, Gladiator): `{Game Name} Slot | Exclusive to MetaWin Casino`
- Keep under 60 characters (excluding the auto-appended kicker)

**Meta Description** (max 160 chars):
- Format: `Play {Game Name} from {Provider} at MetaWin Casino. {Key selling point using maxWin/RTP/feature}. Play now with BTC, ETH + more!`
- For exclusive games: `Play {Game Name} exclusively at MetaWin Crypto Casino. Win up to x{maxWin} your stake! Play now with 20+ cryptocurrencies like BTC, ETH & SOL.`
- Include one concrete number (max win or RTP) as a hook
- Keep under 160 characters

### Step 4: Build the JSON file

Write a JSON file to `./tmp/[slug].json` with this structure:

```json
{
  "title": "All About The Fish",
  "provider": "Gladiator",
  "rtp": 96.40,
  "volatility": "high",
  "maxWin": "10,000x",
  "minBet": "$0.20",
  "maxBet": "$300",
  "paylines": "243",
  "reels": 5,
  "hasFreeSpins": true,
  "hasBonusFeature": true,
  "hasAutoplay": true,
  "releaseDate": null,

  "seo": {
    "metaTitle": "All About The Fish Slot | Play with BTC, ETH+ more at MetaWin",
    "metaDescription": "Play All About The Fish exclusively at MetaWin Crypto Casino. Win up to x10k your stake! Play now with 20+ cryptocurrencies like BTC, ETH & SOL.",
    "hideKicker": true
  },

  "content": [
    {
      "_type": "gameQuickSummary",
      "_key": "a1b2c3d4",
      "intro": [ /* Portable Text blocks */ ]
    },
    {
      "_type": "gameRichText",
      "_key": "e5f6a7b8",
      "tocTitle": "Introduction",
      "content": [ /* Portable Text blocks */ ]
    },
    {
      "_type": "gameRichText",
      "_key": "c9d0e1f2",
      "tocTitle": "How to Play",
      "content": [ /* Portable Text blocks */ ]
    },
    {
      "_type": "gameRichText",
      "_key": "a3b4c5d6",
      "tocTitle": "Bonus Features",
      "content": [ /* Portable Text blocks */ ]
    },
    {
      "_type": "gameTable",
      "_key": "e7f8a9b0",
      "title": "Low Value Symbols",
      "tableData": {
        "headers": ["Number", "10", "J", "Q", "K", "A"],
        "rows": [
          { "_type": "tableRow", "_key": "r1a2b3c4", "cells": ["3", "$5", "$5", "$5", "$5", "$5"] }
        ]
      },
      "striped": true,
      "highlightFirstColumn": true
    },
    {
      "_type": "gameTable",
      "_key": "c1d2e3f4",
      "title": "High Value Symbols",
      "tableData": { "headers": [], "rows": [] },
      "striped": true,
      "highlightFirstColumn": true
    },
    {
      "_type": "gameRichText",
      "_key": "a5b6c7d8",
      "tocTitle": "Symbols and Paytable",
      "content": [ /* Descriptive text + bullet list, NOT the tables */ ]
    },
    {
      "_type": "gameRichText",
      "_key": "e9f0a1b2",
      "tocTitle": "Tips",
      "content": [ /* Bullet list blocks */ ]
    },
    {
      "_type": "gameProsAndCons",
      "_key": "c3d4e5f6",
      "pros": ["Unique game theme", "Rockin' Bass feature"],
      "cons": ["High volatility", "Low base game payouts"]
    },
    {
      "_type": "gameTable",
      "_key": "a7b8c9d0",
      "title": "All About The Fish vs Big Bass Bonanza",
      "introText": [ /* Portable Text for comparison intro paragraphs */ ],
      "tableData": {
        "headers": ["Feature", "All About The Fish", "Big Bass Bonanza"],
        "rows": []
      },
      "striped": true,
      "highlightFirstColumn": true
    }
  ],

  "faq": [
    {
      "_type": "faqItem",
      "_key": "f1a2b3c4",
      "question": "Who made All About The Fish?",
      "answer": [ /* Portable Text blocks */ ]
    }
  ]
}
```

### Step 4b: Fact-check and proofread

Before patching, scan the JSON content for factual errors and broken English. Only flag egregious issues — don't rewrite the writer's voice. Common problems to catch:

**Factual errors:**
- Never mention "KYC" or "no KYC" in any form. Remove all references to KYC verification (or lack thereof). This includes phrases like "no KYC required", "without KYC", "with KYC verification", etc.
- "our blockchain" → MetaWin does not own a blockchain. Use "the blockchain" or "on-chain"
- Incorrect product/wallet names (e.g. "MetaDesk" instead of "MetaMask")
- Wrong game mechanics or stats that contradict the review's own data
- "provably fair algorithm" → use "provably fair system" (it's cryptographic seed hashing, not an algorithm)

**Grammar/coherence:**
- Pronoun agreement errors (e.g. "We've gone for... with its game" — "we" + "its" clash)
- Typos in game names
- Sentences that don't parse as English
- **Never use em-dashes (—)** anywhere in content. Replace with commas, semicolons, or restructure the sentence.

**Tone check on Cons:**
- Review the cons list for overly negative language that could dissuade players
- We want to be honest but not off-putting — reframe harsh cons into neutral observations
- e.g. "The game is boring and repetitive" → "The gameplay is straightforward with fewer features than modern slots"
- Flag any cons that feel too negative and suggest softer alternatives

**Process:**
1. List each issue with the original text and proposed fix
2. Include any cons that need toning down
3. Ask the user to confirm before patching
4. Apply fixes to the JSON before running the patch script
5. Also check that author quotes still make sense after fixes

### Step 5: Add screenshots to images folder

Place screenshots in `C:\Users\lukas\OneDrive\SEO Briefs\Images\` using the naming convention `{game-slug}-1.png`, `{game-slug}-2.png`, etc. The script will auto-detect them by matching against the game's Sanity slug or title.

### Step 6: Patch Sanity

The patch script handles everything in one go — content, metadata, SEO, FAQ, and screenshots:

```bash
node scripts/patch-game.js ./tmp/all-about-the-fish.json --dry-run
```

Review the dry-run output (content blocks, FAQ, fields, screenshot distribution), then apply:

```bash
node scripts/patch-game.js ./tmp/all-about-the-fish.json
```

The script will:
- Patch all content blocks, FAQ, metadata, and SEO
- Auto-detect screenshots from the images folder
- Upload them to Sanity's asset pipeline
- Add all images to the `screenshots[]` slideshow
- Embed up to 2 inline images across the first 2 major content sections (Introduction, How to Play) with auto-generated captions

---

## Portable Text Format Reference

Every rich text field in the JSON uses Sanity's Portable Text format.

### Basic paragraph

```json
{
  "_type": "block",
  "_key": "ab12cd34",
  "style": "normal",
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "ef56gh78", "text": "Paragraph text here.", "marks": [] }
  ]
}
```

### Heading

Same as paragraph but with `"style": "h2"`, `"h3"`, or `"h4"`.

### Bold / italic spans

Use decorator marks directly on spans — no markDef needed:

```json
{
  "_type": "block",
  "_key": "ij90kl12",
  "style": "normal",
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "mn34op56", "text": "Bold text", "marks": ["strong"] },
    { "_type": "span", "_key": "qr78st90", "text": " then normal.", "marks": [] }
  ]
}
```

- Bold: `"marks": ["strong"]`
- Italic: `"marks": ["em"]`
- Bold+italic: `"marks": ["strong", "em"]`

### List item

All lists MUST use `"listItem": "number"` (never `"bullet"`), even if the source doc uses bullets:

```json
{
  "_type": "block",
  "_key": "uv12wx34",
  "style": "normal",
  "listItem": "number",
  "level": 1,
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "yz56ab78", "text": "A list item.", "marks": [] }
  ]
}
```

### List item with bold lead (common in tips and bonus features)

```json
{
  "_type": "block",
  "_key": "cd90ef12",
  "style": "normal",
  "listItem": "number",
  "level": 1,
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "gh34ij56", "text": "Coin Collect", "marks": ["strong"] },
    { "_type": "span", "_key": "kl78mn90", "text": ": If two golden wild symbols land...", "marks": [] }
  ]
}
```

### Key rules

- Every `_key` must be **globally unique** across the entire JSON. Use random 8-char lowercase hex strings.
- Every `gameRichText` block MUST start with an H2 heading (`"style": "h2"`) as the first block in its `content` array. Use the original section heading from the doc (e.g. "Great Rhino Megaways Introduction", "How to Play Great Rhino Megaways", "Bonus Features", etc.).
- For `gameTable` blocks that represent a full section (Symbols & Paytable, Comparison), put the H2 heading and any descriptive text in the table's `introText` field — do NOT create a separate `gameRichText` block for them.
- Do **NOT** include image references — skip all images from the doc.
- FAQ in the doc uses alternating bullet (question) / paragraph (answer). Parse accordingly.
- Table cell values: keep as-is including `$` signs. Empty cells must be filled with "N/A".
- Extract `rtp`, `volatility`, `reels`, `paylines`, `maxWin` from the review text where mentioned.
- Set `hasFreeSpins`, `hasBonusFeature`, `hasAutoplay` booleans from what the content describes.
- Always use `"listItem": "number"` for all lists — never use `"bullet"`.
- Always set `"hideKicker": true` in the `seo` object to prevent overly long titles.

---

## Title matching

The game title in the JSON must match the Sanity document title exactly. Before building the JSON, check the Sanity title — it may differ from the .docx filename:
- Some games have "Slot" appended (e.g. "Sweet Bonanza Slot" not "Sweet Bonanza")
- Crash games may use a shorter name (e.g. "Aviator" not "Crash Aviator")
- Always verify the dry-run match before applying. If a fuzzy match picks the wrong game, update the title and retry.

---

## Non-slot games (crash, table games, etc.)

Not all games are slots. Adapt the import for non-slot games:
- Omit `reels` and `paylines` fields entirely (don't set to null)
- "Symbols and Paytable" section may have no table — use a `gameRichText` block with descriptive text instead of a `gameTable`
- Section headings in the doc may be plain text lines instead of `##` markdown headings — detect by pattern matching
- Tips and bonus features may use bullet lists in the source — still convert to numbered lists

---

## What the script patches vs. what to do manually

**Patched by script:**
- `content[]` — All content blocks (including `gameAuthorThoughts` quotes)
- `faq[]` — FAQ items
- `seo` — metaTitle, metaDescription, hideKicker (auto-generated)
- `rtp`, `volatility`, `maxWin`, `minBet`, `maxBet`, `paylines`, `reels`
- `hasFreeSpins`, `hasBonusFeature`, `hasAutoplay`
- `releaseDate`, `provider`

**Also auto-set by script:**
- `author` — randomly assigned from Ziv Chen, Luke Jones, or Jeffrey Gynn
- `publishedAt` / `updatedAt` — set to today's date
- `showAuthorInfo` — toggled on

**Set manually in Sanity Studio after import:**
- Published / Updated dates
- `showAuthorInfo`, `isFeatured`, `isNew`, `isPopular` flags
- Game Schema (structured data) settings

---

## Batch Import

```bash
for f in reviews/*.docx; do
  echo "=== $f ==="
  # Claude Code: parse each file and output JSON to tmp/
done

for f in tmp/*.json; do
  node scripts/patch-game.js "$f" --dry-run
done
```

Review dry-runs, then re-run without `--dry-run`.
