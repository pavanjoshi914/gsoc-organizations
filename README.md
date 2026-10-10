# 🌟 GSoC Organizations Pro (2016–2026)

A modern, high-performance web platform to explore, filter, and analyze all **519 organizations** and **12,095 student projects** participating in Google Summer of Code across 11 years (2016–2026).

Built with **React 19**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** design patterns.

---

## 🚀 Key Improvements over `gsocorganizations.dev`

| Feature | Original (`gsocorganizations.dev`) | GSoC Organizations Pro (This Clone) |
| :--- | :--- | :--- |
| **Design System** | Dated 2018 Semantic UI (Gatsby) | **Modern shadcn/ui + Tailwind (Zinc & Orange)** |
| **Theme** | Light only | **Seamless Dark / Light Mode** |
| **Organizations** | Incomplete older list | **All 519 Orgs verified (2016 to 2026)** |
| **Student Project Archives** | Clunky redirect | **Tabbed on-demand explorer with student names & code links** |
| **Organization Comparison** | ❌ Not available | **Side-by-side comparison matrix (up to 4 orgs)** |
| **Shortlisting / Bookmarks** | ❌ Not available | **Saved target list with Markdown & CSV export** |
| **Consistency Tracking** | Text only | **Visual participation timeline dots (11/11 years)** |
| **Analytics & Insights** | Basic table | **Comprehensive 11-year trends, top tech & Hall of Fame** |
| **Performance** | Multi-megabyte initial bundle | **Sub-50ms instant initial load + on-demand project loading** |

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

