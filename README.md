# Copy File Object

**Copy actual files, not just paths!**

This VS Code extension allows you to copy a file from the Explorer as a real **File Object**. This enables you to paste the file directly into browser-based applications like ChatGPT, Claude, Gemini, or Slack, just as if you had dragged and dropped it from your OS file manager.

## ✨ Features
- 🚀 **Cross-Platform Support**: Works on **macOS**, **Windows**, and **Linux**.
- 🖱️ **Context Menu**: Right-click any file in the Explorer and select `Copy File Object`.
- ⌨️ **Keyboard Shortcuts**: Quickly copy the current file with a shortcut.
- 📋 **Native Clipboard**: Uses system-level commands (AppleScript, PowerShell, xclip) to ensure compatibility.

## 🎯 How to Use

### Method 1: Context Menu
1. Right-click a file in the VS Code Explorer.
2. Select **Copy File Object**.
3. Go to your browser (ChatGPT, Gemini, etc.) and press `Cmd+V` (Mac) or `Ctrl+V` (Win/Linux).

### Method 2: Keyboard Shortcut
1. Select a file in the Explorer OR open a file in the editor.
2. Press the shortcut key:
   - **macOS**: `Cmd` + `Shift` + `C`
   - **Windows / Linux**: `Ctrl` + `Shift` + `C`
3. Paste it anywhere!

---

## ⚠️ Requirements

### For Linux Users 🐧
This extension relies on `xclip` to manipulate the clipboard on Linux.
Please install it via your terminal:

```bash
# Ubuntu / Debian
sudo apt install xclip

# Fedora / CentOS
sudo dnf install xclip

# Arch Linux
sudo pacman -S xclip
```
