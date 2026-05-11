# ApplyAI 🚀

> **Next-Generation, AI-Powered Career Search & Application Tracker.** 
> A premium, high-fidelity marketing landing page engineered with React 19, Tailwind CSS v4, and decoupled Framer Motion spring physics.

[![Live Demo](https://img.shields.io/badge/Live-Demo_Available-06B6D4?style=for-the-badge&logo=vercel&logoColor=white)](https://apply-ai-iota-three.vercel.app/)
[![React Version](https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind Version](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## ✨ Features & Interactive Simulators

Instead of standard, static image mockups, this landing page utilizes custom-engineered, fully-responsive CSS and SVG widgets representing advanced SaaS user experiences:

*   **📊 Live Analytics Dashboard:** Track active applications, conversion rates, and weekly progress charts rendered natively.
*   **📋 AI Resume Matcher:** Interactive interface simulating a PDF parsing scanner, outputting immediate fit metrics.
*   **📝 Automated Follow-up Notes:** Sleek, micro-animated sticky cards highlighted by days-since-applied rules.
*   **💼 AI Interview Prep simulator:** Conversational thread displaying questions, active response indicators, and scoring metrics.
*   **✉️ Outreach Co-Pilot:** Instant draft composition simulator mimicking generative writing feeds.

---

## 🎨 Design System & Animation Architecture

### Decoupled Motion Presets
To keep components focused purely on structure and markup, all Framer Motion variants are decoupled into a dedicated configuration layer at [`src/utils/animations.ts`](./src/utils/animations.ts).

*   **Staggered Layout Inlets:** Containers automatically stagger the entry of child headings and buttons on page load, avoiding jarring raw animations.
*   **Asynchronous Widget Floating:** Active floating previews desynchronize their infinite loops utilizing independent offsets and custom delays for organic hover feedback.
*   **Viewport Scrolling triggers:** Section items gracefully fade-and-slide up only when cross-intersecting the user's viewport boundary.

---

## 🛠️ Elite Tech Stack

*   **Core:** React 19.2.6 & TypeScript
*   **Bundler:** Vite 7.3.2
*   **Styles:** Tailwind CSS v4.0 (Utilizing modern CSS-first configurations)
*   **Icons:** Lucide React
*   **Animations:** Framer Motion 12.38.0

> [!NOTE]
> **Single-File Inline Compilation:** 
> This project is configured with `vite-plugin-singlefile`. During compilation, Vite automatically bundles all React logic, styles, and assets **directly into a single, self-contained `dist/index.html` file** in under 6 seconds. This provides unparalleled page load times, 100/100 Lighthouse performance, and effortless deployment.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the development dependencies:
```bash
git clone https://github.com/1ewig/apply-ai.git
cd apply-ai
npm install
```

### 2. Run Locally (Dev Mode)
Boot up Vite's local development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Compilation (Production)
Build the single-file inlined bundle:
```bash
npm run build
```
Verify the compiled, self-contained landing page at `dist/index.html`.

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE). Created as a showcase of high-end frontend engineering.
