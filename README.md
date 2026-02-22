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
*   **V3 AI Enhancement Engine:** An intelligent overlay that analyzes the base architecture and heuristically injects critical layers (Redis caching, Read Replicas, WebSockets, Alerting Systems) based on traffic logic.
*   **Visual Cost Estimator:** Real-time computation of monthly infrastructure costs, broken down into a responsive donut chart (powered by Recharts).
*   **Premium Glassmorphism UI:** Features a custom hardware-accelerated 100,000-star animated background, glowing neomorphic cards, and fluid 60FPS stagger animations via Framer Motion.
*   **One-Click Image Export:** Instantly download high-resolution PNGs of your generated cloud topology graphs for presentations.
*   **Raw Diagram Editor:** A live-updating syntax editor allowing power users to modify the generated Mermaid code on the fly.
*   **Interactive Explainers:** Deep-space modals providing instant definitions for over 20+ different infrastructure components.

## 🚀 Tech Stack

ARCHITECT-X is built entirely on free-tier technologies, requiring zero paid external APIs or database connections to operate:

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

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Navigate to `http://localhost:3000` in your browser.

## 🌐 Deploying to Vercel

This project is completely optimized for Vercel Edge deployments out of the box. 

1. Push your code to your GitHub repository.
2. Go to [Vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your `architect-x` repository.
4. Click **Deploy**.

*No environment variables required!*

---
*Built with precision for modern cloud architects.*
