# POTM App (Frontend)

The **Programmer of the Month (POTM) App** is the modern, futuristic frontend for the competitive coding platform. It features a "Midnight Glass" aesthetic, providing a premium "Command Center" experience for developers.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Design System:** "Midnight Glass" (Dark mode, glassmorphism, glowing accents)

## ✨ Key Features

- **Futuristic UI/UX:**
  - **Bento Grid Dashboard:** A modular, high-density display of stats and missions.
  - **Glassmorphism:** Translucent cards (`bg-white/5`) with backdrop blur and subtle borders.
  - **Responsive Design:** Fully optimized for desktop and mobile command centers.

- **User Experience:**
  - **Authentication:** Seamless Login/Register flow with hard redirects for state consistency.
  - **Public Profiles:** Detailed pages showing user rank, total score, and tournament history.
  - **Dynamic Navigation:** Context-aware header with user avatar and admin links.

- **Core Modules:**
  - **Dashboard:** Real-time overview of active operations and global stats.
  - **Tournaments:** Browse active, upcoming, and completed coding missions.
  - **Leaderboard:** Global "Hall of Fame" ranking top operatives.
  - **Admin Panel:** Specialized interface for admins to deploy new tournaments and manage users (manual score/role overrides).

## 🚀 Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env.local` file:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `app/admin/`: Admin-specific pages (Dashboard, Create Tournament).
- `app/components/`: Reusable UI components (Header, Cards).
- `lib/api.ts`: Centralized fetcher utility for API communication.
- `app/globals.css`: Global styles, variables, and Tailwind directives.