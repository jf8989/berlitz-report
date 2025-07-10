# Berlitz Report AI Dashboard 📊

An interactive, full-stack dashboard for analyzing student performance data, featuring a conversational AI assistant powered by Google Gemini. This project transforms static spreadsheet data into a dynamic, insightful, and user-friendly web application.

I decided to create this project when I quit my English Teaching job at Berlitz and wanted them to get a special report about each one of my classes and students.

![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)

***

## 🚀 Live Demo

**(https://berlitz-report.vercel.app/)**

***

## ✨ Key Features

*   **📈 Dynamic Group Dashboards:** Instantly visualize class performance with interactive charts for attendance, punctuality, and progress.
*   **🧑‍🎓 Detailed Student Reports:** Drill down into individual student records with dedicated pages showing attendance history, compliance status, and personal statistics.
*   **🤖 AI-Powered Chat Assistant:** Ask complex, natural language questions about students and groups. The AI synthesizes data from quantitative reports and the teacher's qualitative notes to provide comprehensive answers.
*   **📄 Interactive Handover Report:** View the teacher's detailed handover notes in a beautifully formatted, modern modal with a blurred backdrop.
*   **🖼️ Dynamic Image Display:** The AI can intelligently offer to display relevant images within the chat interface based on the conversation.
*   **🎨 Light & Dark Mode:** A sleek, theme-aware interface that respects user system preferences.
*   **📱 Fully Responsive Design:** A seamless experience on desktops, tablets, and mobile devices, built with a mobile-first approach.

***

## 🛠️ Tech Stack

| Category          | Technologies                                                                   |
| ----------------- | ------------------------------------------------------------------------------ |
| **Frontend**      | ⚛️ Next.js (App Router), ⚛️ React, 🔵 TypeScript, 💨 Tailwind CSS                  |
| **AI & Backend**  | 🧠 Google Gemini 1.5 Flash, ⚡ Vercel Edge Functions                             |
| **Database**      | 🗂️ Dexie.js (for client-side IndexedDB chat persistence)                        |
| **UI & Charting** | 📊 Recharts, ✨ Custom Components, 🎨 Tailwind Typography, 💡 Lucide React (Icons) |
| **Deployment**    | ▲ Vercel                                                                       |

***

## 🏛️ Project Architecture & Philosophy

This project was built with a focus on modern web architecture, maintainability, and a clear separation of concerns.

*   **🧠 Prompt-Oriented Design (POD):** The AI's behavior is not hard-coded. It is shaped through a meticulously crafted `SYSTEM_PROMPT` that defines its persona, rules, and tools. This makes the AI's logic easy to update and iterate on without changing application code.

*   **🧱 UI/Logic Decoupling:** UI components (`.tsx` files in `/components`) are "dumb." They are responsible only for rendering and emitting events. All business logic, state management, and side effects are encapsulated within custom hooks or server-side logic, creating a predictable and traceable data flow.

*   **⚡ Server-First Data Fetching:** We leverage Next.js Server Components (`async` pages) to fetch and process data on the server, ensuring fast page loads and sending only the necessary HTML to the client.

*   **💼 Client-Side State with Dexie.js:** The chat history is persisted in the browser's IndexedDB via Dexie.js. This provides a fast, offline-capable chat experience that remembers conversations between sessions without needing a server-side database.

***

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/jf8989/berlitz-report.git
cd berlitz-report
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

This project requires a Google Gemini API key and a system prompt.

Create a file named `.env.local` in the root of the project and add the following content:

```env
# .env.local

# Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY="AIzaSy..."

# This is the full system prompt that defines the AI's behavior.
# Copy the final version from our development process.
SYSTEM_PROMPT="<persona>You are Max, a helpful and professional AI assistant...</persona>..."
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

***

## 📁 Folder Structure

The project follows a standard Next.js App Router structure:

```
/
├── public/
│   └── images/
│       └── basf7.jpg       # Static assets
├── src/
│   ├── app/
│   │   ├── (main)/         # Main application routes
│   │   │   ├── page.tsx
│   │   │   └── groups/
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts # AI chat API endpoint
│   ├── components/
│   │   ├── ui/             # Generic UI components (Card, Select)
│   │   └── AIChatInterface.tsx
│   │   └── ReportModal.tsx   # All major feature components
│   ├── data/
│   │   ├── berlitzData.ts    # Quantitative data
│   │   └── handoverReport.ts # Qualitative data (Markdown)
│   └── lib/
│       ├── dataParser.ts   # Logic for parsing CSV-like data
│       ├── db.ts           # Dexie.js (IndexedDB) setup
│       └── utils.ts        # Helper functions
└── next.config.js          # Next.js configuration
```

***

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.