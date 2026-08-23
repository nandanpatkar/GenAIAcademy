# Setting up vs code for c++ coding mac devices

> **Slug:** `setting-up-vs-code-for-c-coding-mac-devices`  
> **Published:** 2026-03-07T08:39:17.685Z  
> **Updated:** 2026-03-27T21:46:20.100Z  
> **Keywords:** None  
> **Cover Image:** ![Setting up vs code for c++ coding mac devices]({'$oid': '69abe430307f479fe365258a'})

**Description:** Learn how to install VS Code and set up a C++ development environment on macOS using Homebrew, GCC, and required VS Code extensions.

---

### **Step 1: Installation Process**

- Firstly, Install **Homebrew, **It makes it easier to **install** software on **macOS**.
- Open the Terminal and run the following command: 
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- Install Xcode Command Line Tools.
- Use this command: `xcode-select --install`.

### **Step 2:  Install Visual Studio Code**

- Download and install **Visual Studio Code** from the official website
- Complete the **installation** by following the **on-screen** instructions for macOS.

### **Step 3: Set Up a VS Code for C++**

- Install C++ Compiler, Make sure the **GNU Compiler Collection (GCC)** is installed by running the following command: `brew install gcc`.
- Set up **Extensions** in VS Code:
- - Open VS Code.
  - Navigate to the Extensions icon.
  - Install the following: **C/C++** by **Microsoft**, **Code Runner**.

### **Step 4: Configuring the Environment **

- Setting Up Tasks in VS Code.
- Create a ***.vscode/tasks.json*** file in your project directory to automate the build process. Here’s a basic setup:

### **Step 5: Compiling and Running C++ Programs**

- Compile the C++ file using the task configure earlier in VS Code.
- Run the compiled program: `./main`.





---
*Extracted from CodeHelp (https://www.codehelp.in/articles/setting-up-vs-code-for-c-coding-mac-devices)*
