<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier"/>
  <img src="https://img.shields.io/badge/Stylelint-263238?style=for-the-badge&logo=stylelint&logoColor=white" alt="Stylelint"/>
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

# Next.js Template

## What You DON'T Need To Do! 🎉
This template saves you time by having everything pre-configured:
- ✅ No need to run `create-next-app`
- ✅ No need to install and configure Tailwind CSS
- ✅ No need to set up TypeScript
- ✅ No need to configure ESLint, Prettier, or Stylelint
- ✅ No need to set up folder structure (`src` directory, `lib` for utils)
- ✅ No need to configure font optimization with `next/font` and `geist/font`
- ✅ No need to set up CSS variables for theming and dark mode
- ✅ No need to configure advanced Tailwind plugins (typography, forms, animate, aspect-ratio)
- ✅ No need to create common UI utility functions (like `cn` for classnames)
- ✅ No need to install Framer Motion for advanced animations (if you choose to use it, it's ready to be added)

Just clone and start coding!

## Core Stack & Key Configurations

This template is built with a modern, robust stack. Here's a look at the key technologies and how they're configured:

*   **Next.js (App Router):**
    *   Utilizes the latest Next.js features, including the App Router for intuitive routing and server components.
    *   Optimized font loading via `next/font` and `geist/font`.
    *   Comprehensive `next.config.ts` for project settings.

*   **React & Animation:**
    *   Built with the latest React for modern UI development.
    *   **Framer Motion** (to be installed if needed): The template is ready for Framer Motion if you require complex, interactive animations.
    *   **`tailwindcss-animate`:** Included for simpler CSS-driven animations via Tailwind utilities.

*   **Tailwind CSS:**
    *   Fully configured in `tailwind.config.ts` with an extensive theme:
        *   **CSS Variables:** Heavily uses CSS variables (defined in `globals.css`) for colors, spacing, radius, etc., enabling easy theming and dark mode.
        *   **Color Palette:** Includes system colors, primary/secondary, semantic colors (success, warning, error), and professional palettes (navy, gray, sky, beige).
        *   **Dark Mode:** Class-based dark mode (`darkMode: "class"`) integrated with CSS variables.
        *   **Fonts:** All fonts defined in `layout.tsx` are available as CSS variables and configured in Tailwind.
        *   **Animations & Keyframes:** A rich set of pre-defined animations, complemented by `tailwindcss-animate`.
        *   **Plugins:**
            *   `@tailwindcss/typography`: For beautiful default styling of prose content (like Markdown).
            *   `@tailwindcss/forms`: Provides sensible defaults for form elements.
            *   `@tailwindcss/aspect-ratio`: For easy aspect ratio control.

*   **TypeScript:**
    *   Strict type checking and modern syntax used throughout the project, including configuration files.

*   **Styling & UI Utilities:**
    *   **`globals.css`:** Contains base styles, CSS variable definitions for light/dark themes, and custom component classes using `@layer components`.
    *   **`clsx` & `tailwind-merge`:** Used via the `cn` utility in `src/lib/utils.ts` for robust conditional class name generation, preventing Tailwind class conflicts.

*   **Linting & Formatting:**
    *   **ESLint:** Configured with TypeScript support (`@typescript-eslint`) to enforce code quality and modern JavaScript/TypeScript practices.
    *   **Prettier:** Integrated for consistent code formatting.
    *   **Stylelint:** Configured with `stylelint-config-tailwindcss` to lint CSS and understand Tailwind-specific syntax (like `@apply` and `@layer`).
    *   **VS Code Integration:** Settings in `.vscode/settings.json` are optimized for this stack, ensuring linters and the Tailwind CSS IntelliSense extension work correctly.

*   **Development Environment:**
    *   Ready-to-use scripts in `package.json` for development (`npm run dev`) and building.
    *   Git repository setup instructions for a clean start, defaulting to `main` branch.

## Step-by-Step Setup Instructions

### 1. Create Your Project Folder
First, let's set up your workspace:

1. Create a new folder on your computer where you want your project to live
   ```bash
   # In Windows File Explorer:
   - Right-click > New > Folder
   - Name it your project name (example: "my-next-website")

   # OR in PowerShell:
   New-Item -ItemType Directory -Path "my-next-website"
   Set-Location my-next-website
   
   # OR in Command Prompt:
   mkdir my-next-website
   cd my-next-website
   ```

2. Open VS Code
   - Open VS Code
   - Go to File > Open Folder
   - Select the folder you just created

3. Open the VS Code terminal
   - Press `` Ctrl + ` `` (backtick key) or
   - Go to View > Terminal
   - Make sure PowerShell is selected as your terminal (click the dropdown in the terminal if needed)

### 2. Clone the Template
In the VS Code terminal (PowerShell):
```powershell
# Make sure the directory is completely empty before attempting to clone the repo
git clone https://github.com/jf8989/next-js-template-jf8989.git .
```
(Don't forget the dot at the end - it means "clone into current folder")

### 3. Set Up Fresh Git Repository
In the same terminal:
```powershell
# Remove the template's git history
Remove-Item -Recurse -Force .git

# Start fresh git repository (it will likely default to 'main' or you can set it)
git init

# Ensures the current branch is named 'main'
git branch -M main 

# First, check if you have any remotes configured
git remote -v

# Add your own repository (replace with your actual GitHub repository URL)
# Note: Make sure you first create the repository on GitHub!
git remote add origin https://github.com/username/repo-name.git

# Verify your remote was added correctly
git remote -v

# Stage and commit your initial files
git add .
git commit -m "Initial commit from template" # Changed commit message

# Push to your repository
git push -u origin main
```

### 4. Install Dependencies
Still in the terminal:
```powershell
# Install all needed packages
npm install

# If you need to update your Next.js version
npm install next@latest

# Then check the version installed
npx next --version

# Then install Vercel globally for deployment
npm install -g vercel

# To login into Vercel
vercel login
vercel
```

### 5. Start Development Server
```powershell
# Start your project
npm run dev
```

### 6. View Your Website
- Open your browser
- Go to http://localhost:3000
- You should see your new website!

### 7. Start Developing
- Create a new branch for your feature or brief
```powershell
# Create and switch to new branch (e.g., for a client brief)
git checkout -b client-brief 

# Stage and commit your initial files on this branch
git add .
git commit -m "Start work on client brief"

# Return to main branch if needed
# git checkout main 
```
- Open `src/app/page.tsx` in VS Code to edit the home page.
- Modify components in `src/components/`.
- Save changes and they'll update automatically in your browser.

### 8. Deploy Feature Branch to Vercel (e.g., client-brief)
- Deploy using CLI directly within your project's terminal:
```powershell
# Ensure you are on the branch you want to deploy (e.g., client-brief)
# git checkout client-brief 

# 1. Run the deploy command (Vercel CLI automatically deploys the current branch)
vercel
# For a production deployment of a specific branch (less common for feature branches):
# vercel --prod 

# 2. When prompted (first time for this project):
   - "Set up and deploy" → press Enter
   - "Which scope do you want to deploy to?" → choose your account (press Enter)
   - "Link to existing project? (y/N)" → type N (if it's a new Vercel project for this template instance)
   - "What’s your project’s name?" → type your project name (e.g., my-awesome-app)
   - "In which directory is your code located?" → press Enter (defaults to current folder)
   - Vercel will auto-detect it’s a Next.js project
   - "Want to override settings?" → type N
   - "Install Command, Build Command, Output Directory" → press Enter for all (defaults)
# 3. Wait for deployment to complete. You'll get a preview URL.
```
- OR (Using Vercel Dashboard):
1. Go to [Vercel](https://vercel.com)
2. Open your project dashboard.
3. Vercel automatically deploys branches pushed to your connected Git repository. You can find preview URLs under "Deployments".

Preview deployment URLs are typically like: `your-project-name-git-your-branch-name-your-vercel-username.vercel.app`

## Common Issues & Solutions

- If `git clone` doesn't work: Make sure you have Git installed
  - Download from: https://git-scm.com/downloads

- If `npm` commands don't work: Install Node.js
  - Download from: https://nodejs.org
  - Choose the "LTS" (Long Term Support) version

- If PowerShell says "running scripts is disabled":
  1. Open PowerShell as Administrator
  2. Run: `Set-ExecutionPolicy RemoteSigned`
  3. Type 'Y' to accept

## Project Structure

```
your-project-folder/
├── .vscode/            # VS Code specific settings (e.g., for linters)
├── public/             # Static assets (images, fonts if not using next/font)
├── src/
│   ├── app/            # Next.js App Router: pages, layouts, globals.css
│   │   ├── layout.tsx  # Main layout for the application
│   │   ├── page.tsx    # Home page
│   │   └── globals.css # Global styles and CSS variable definitions
│   ├── components/     # Reusable React components
│   └── lib/            # Utility functions
│       └── utils.ts    # Utility functions (e.g., cn)
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration (for Tailwind)
├── tsconfig.json       # TypeScript configuration
├── next.config.ts      # Next.js configuration
├── eslint.config.mjs   # ESLint configuration (or .eslintrc.js)
├── stylelint.config.js # Stylelint configuration
└── package.json        # Project dependencies and scripts
```

## Features Included

- Next.js 14+ (modern React framework with App Router)
- React 19 (latest React features)
- Framer Motion (ready for advanced animations, install if needed)
- Tailwind CSS (for utility-first styling)
- TypeScript support (for type safety)
- ESLint, Prettier, and Stylelint (for code quality and formatting)
- Responsive layout (inherent with Tailwind)
- Class-based dark mode with CSS variables
- CSS Variable-based theming
- Advanced Tailwind CSS setup with plugins (Typography, Forms, Aspect Ratio, Animate)
- Optimized font loading with `next/font` and `geist/font`

## Development Tips

### Creating New Pages
To add a new page (example: About page):
1. Create a new folder in `src/app`
2. Name it what you want the URL to be (e.g., `about`)
3. Add a `page.tsx` file inside that folder

Example:
```
src/
└── app/
    └── about/
        └── page.tsx    # Creates /about page
```

### Adding Styles
Use Tailwind CSS classes directly in your React components:
```jsx
<div className="text-blue-500 p-4 bg-card rounded-lg">
  This text will be blue with padding on a card background.
</div>
```
Refer to `globals.css` for defined CSS variables (like `--card`) and custom component classes (like `.button`).

## Deployment

When ready to publish your main branch for production:

1. Push your changes to the `main` branch on GitHub.
2. Go to [Vercel](https://vercel.com).
3. If you haven't already, connect your GitHub repository to a new Vercel project.
4. Vercel will automatically build and deploy your `main` branch. Production deployments typically use the root domain you configure with Vercel.
5. To trigger a production deployment manually for the latest commit on `main`:
   ```powershell
   vercel --prod
   ```

## Need Help?

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Geist Font Documentation](https://vercel.com/font)

## License

MIT License - Free to use for any purpose