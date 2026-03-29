# 🪟 Running GenAI Academy on Windows

Follow these steps to set up and run this project on any Windows machine.

### 1. Install Node.js
If you haven't already, download and install **Node.js (LTS version)** from [nodejs.org](https://nodejs.org/).
- This will also install `npm` (Node Package Manager) which we need to install dependencies.

### 2. Copy the Project Folder
Copy your `genai-roadmap-src` folder to your Windows machine (e.g., to your `Documents` or `Desktop`).

### 3. Open the Terminal
1. Open the **Project Folder** in File Explorer.
2. Click on the address bar at the top, type `cmd` or `powershell`, and press **Enter**.
   - *Alternatively: Open VS Code and use the built-in terminal (Ctrl + `).*

### 4. Install Dependencies
Run the following command to download all necessary libraries:
```bash
npm install
```
> [!NOTE]
> This creates a `node_modules` folder. You only need to do this once.

### 5. Start the Development Server
Run this command to start the project:
```bash
npm run dev
```

### 6. View in Browser
Once it starts, you will see a link like `http://localhost:5173/`.
- Press **Ctrl + Click** on the link OR copy and paste it into Chrome/Edge to start learning!

---

### Tips for Portability:
- **API Keys**: Currently, your Gemini and Tavily keys are hardcoded in `src/services/aiService.js`. If you ever change keys, that's where to look.
- **Node Modules**: Never copy the `node_modules` folder when moving the project. Always run `npm install` on the new machine instead.
