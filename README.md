# 🌟 GSoC Organizations Pro (2016–2026)

A modern, high-performance web platform to explore, filter, and analyze all **519 organizations** and **12,095 student projects** participating in Google Summer of Code across 11 years (2016–2026).

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** design patterns.

---

## 🚀 Features & Capabilities

- **Modern shadcn/ui Design System**: Dark / Light mode with Zinc & Orange theme tokens.
- **Complete 11-Year Coverage**: All 519 organizations from 2016 through 2026.
- **Detailed Student Project Archives**: 12,095 student projects with abstracts, student names, and code URLs.
- **Side-by-Side Comparison Matrix**: Compare up to 4 organizations across years, slots, and tech stacks.
- **Smart Shortlisting & Export**: Bookmark target organizations and export to Markdown or CSV.
- **Visual Consistency Timeline**: 11-year participation history for every organization.
- **11-Year Analytics & Insights**: Tech stack distributions, student capacity trends, and Veterans Hall of Fame.
- **Ultra-Fast Performance**: Instant client-side fuzzy search with sub-50ms query speeds.

---

## 🛠️ Architecture & Dataset

* **All 519 Organizations** verified and compiled from the official GSoC archive.
* **12,095 Student Projects** archived with descriptions, code URLs, and student names.
* **566 Technologies** (Python, C++, Rust, Go, JavaScript, TypeScript, PyTorch, ROS, etc.).
* **13 GSoC Categories** ('Artificial Intelligence', 'Science and medicine', 'Operating systems', 'Web', 'Cloud', etc.).

### Directory Structure:
```
/data/codebases/macos app/gsoc-organizations/
├── public/
│   └── data/
│       ├── organizations.json   (Minified index of all 519 orgs for instant search)
│       └── orgs/                (519 individual JSON files with student project archives)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── OrganizationCard.tsx
│   │   ├── OrganizationDetailModal.tsx
│   │   ├── CompareModal.tsx
│   │   ├── AnalyticsModal.tsx
│   │   └── ShortlistModal.tsx
│   ├── types.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── run.sh
```

---

## ⚡ Quick Start

```bash
cd "/data/codebases/macos app/gsoc-organizations"
./run.sh
```
Or with Node v24:
```bash
export PATH="/home/pavan/.nvm/versions/node/v24.18.0/bin:$PATH"
npm run dev
```

Visit: `http://localhost:3000`

---

## 📦 Production Build
```bash
export PATH="/home/pavan/.nvm/versions/node/v24.18.0/bin:$PATH"
npm run build
```
Generates an optimized static output in `dist/`, ready to deploy directly to **Vercel**, **Netlify**, or **Cloudflare Pages**.

