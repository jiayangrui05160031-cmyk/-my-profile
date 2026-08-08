<p align="right"><a href="README.md">Chinese</a> | <strong>English</strong></p>

# views / field station

A personal site that does not try to explain everything at once.

It collects research, data tools, code experiments, and a few side quests. The public identity across the site is **views**: no resume-style introduction, and no artificial divide between “serious work” and personal interests.

## What you can explore

| Route | What it does |
| --- | --- |
| [Trade Intelligence](https://github.com/jiayangrui05160031-cmyk/chinatrade-decision) | Combines HS codes, tariffs, policy changes, and a cross-border order in one decision card. |
| [Video Atlas](https://github.com/jiayangrui05160031-cmyk/video-analysis-agent) | Starts with a video URL and produces transcripts, translations, aggregation, and follow-up analysis. |
| [Macro Cockpit](https://github.com/jiayangrui05160031-cmyk/people-daily-economy-daily) | Turns daily macro news into traceable reports and an analytical cockpit. |
| [Customer Orbit](https://github.com/jiayangrui05160031-cmyk/ecommerce-rfm-customer-segmentation) | End-to-end customer analytics with RFM, CLV, churn signals, and next-best actions. |
| [RGame](https://github.com/jiayangrui05160031-cmyk/RGame) | A cross-platform roguelite experiment with auto attacks, weapon cycles, stages, and saves. |

## Small details in the site

- Three themes: dark workbench, daylight paper, and violet night.
- Project-route filters, full research notes, expandable side quests, and random prompt cards.
- Desktop-only panda cursor companion, stardust trails, subtle card tilt, and falling petals.
- An interactive field-station hero: pointer parallax, constellation reticle, placeable stars, and an animated panda.
- Panda clicks and theme changes trigger petal bursts; `↑ ↑ ↓ ↓ ← → ← → B A` unlocks a hidden mode.
- Press `V` for scanlines, `/` for the quick menu, and `Ctrl + ↑` to return to the top.
- Content loads from `dist/content.json`, with embedded notes as a fallback for direct local opening.

## Local preview

This is a static site. Open `index.html` directly or serve it with any static web server. On first use, run:

```bash
npm install
npm run build
```

The build reads Markdown from `content/` and refreshes `dist/content.json`.

## Design principle

> See the situation clearly before deciding how to describe it; work seriously and wander seriously, too.

The site uses no third-party analytics and does not collect visitor input.
