# Setting up vs code for c++ coding windows

> **Slug:** `setting-up-vs-code-for-c-coding-windows`  
> **Published:** 2026-03-07T08:38:06.028Z  
> **Updated:** 2026-03-27T21:46:19.907Z  
> **Keywords:** None  
> **Cover Image:** ![Setting up vs code for c++ coding windows]({'$oid': '69abe3e7307f479fe36524f5'})

**Description:** Step-by-step guide to install VS Code, set up the MinGW C++ compiler, configure extensions, and compile and run C++ programs easily.

---

#### **Step 1: Install Visual Studio Code**

- Download and install **Visual Studio Code** from the official website
- Complete the **installation** by following the **on-screen** instructions.

#### **Step 2: Set Up a C++ Compiler (MinGW)**

- Download and install **MinGW** from its official website.
- During installation, select the **gcc** and **g++** packages (required for compiling C++ programs).
- Add the MinGW **bin** folder (e.g., C:\MinGW\bin) to the system **Path** environment variable.
- Verify installation by opening **Command Prompt** and running: g++ --version.

#### **Step 3: Configure Visual Studio Code**

- Open **VS Code** and install these extensions:
- - **C/C++ by Microsoft**
  - **C++ Intellisense** (for code autocompletion)
- Create or open a **.cpp** file to start writing C++ code.

#### **Step 4: Configure Tasks in VS Code**

To compile and run C++ programs inside VS Code:

- **Create tasks.json File:**
- - Go to **Terminal → Configure Tasks → Create tasks.json file from template.**
  - Select **Others**.
- **Modify tasks.json:**

- **Run the Task**:
- - Press **Ctrl + Shift + B** to compile the code, then run the generated **.exe** file from the terminal.







---
*Extracted from CodeHelp (https://www.codehelp.in/articles/setting-up-vs-code-for-c-coding-windows)*
