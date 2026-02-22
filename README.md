# 💫 ARCHITECT-X

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-black?style=for-the-badge&logo=framer)

An intelligent, highly-visual cloud topology generator built with a premium "deep-space" aesthetic. **ARCHITECT-X** takes high-level project concepts and translates them into actionable, scale-appropriate cloud architectures using automated heuristic analysis.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ihsan710/architect-x)


## ✨ Features

*   **Intelligent Topology Generation:** Translates natural language project requirements into structured architectures (Monoliths vs. Microservices).
*   **Dynamic Mermaid Graphs:** Renders complex, zoomable, and visually clean system diagrams in real-time.
*   **V4 AI Ideation Engine (Gemini 2.0):** Instantly generate professional project concept briefs from a single keyword. Focuses on actionable requirements and infrastructure needs.
*   **Fully Editable Concepts:** AI-generated text is written directly into the main project input, allowing users to backspace, modify, and refine AI ideas before generation.
*   **One-Click Image Export:** Instantly download high-resolution PNGs of your generated cloud topology graphs for presentations.
*   **Raw Diagram Editor:** A live-updating syntax editor allowing power users to modify the generated Mermaid code on the fly.
*   **Interactive Explainers:** Deep-space modals providing instant definitions for over 20+ different infrastructure components.

## 🚀 Tech Stack

ARCHITECT-X is built on a modern, high-performance stack:

*   **Model:** Google Gemini 2.0 Flash (Native SDK)
*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS + Vanilla CSS Keyframes
*   **Animations:** Framer Motion
*   **Diagrams:** Mermaid.js
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **Utilities:** html-to-image, clsx, tailwind-merge

## 💻 Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/architect-x.git
    cd architect-x
    ```

2.  **Add your local environment variables:**
    Create a `.env` file in the root directory:
    ```text
    GEMINI_API_KEY=your_key_here
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## 🌐 Deploying to Vercel

This project is completely optimized for Vercel Edge deployments. 

1. Push your code to your GitHub repository.
2. Go to [Vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your `architect-x` repository.
4. **Environment Variables:** Add `GEMINI_API_KEY` with your Google AI Studio key.
5. Click **Deploy**.

---
*Built with precision for modern cloud architects.*
