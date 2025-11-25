import * as vscode from 'vscode';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('copy-file-object.copy', async (uri: vscode.Uri) => {

    let targetPath = "";

    // Case 1: Explorer context menu
    if (uri && uri.fsPath) {
      targetPath = uri.fsPath;
    }
    // Case 2: Shortcut
    else {
      if (vscode.window.activeTextEditor) {
        targetPath = vscode.window.activeTextEditor.document.uri.fsPath;
      } else {
        vscode.window.showErrorMessage("No file selected.");
        return;
      }
    }

    const platform = process.platform;

    if (platform === 'darwin') {
      // [macOS] ASObjC with 'NSFilenamesPboardType'

      targetPath = targetPath.normalize('NFC');
      const safePath = targetPath.replace(/"/g, '\\"');

      const script = `
        use framework "AppKit"
        use scripting additions

        try
            set thePath to "${safePath}"

            -- Get the system pasteboard
            set thePasteboard to current application's NSPasteboard's generalPasteboard()

            -- Clear it
            thePasteboard's clearContents()

            -- Create an Array containing the path string (Not URL object)
            set theArray to current application's NSMutableArray's arrayWithObject:thePath

            -- Explicitly declare "NSFilenamesPboardType" (The legacy type Browsers prefer)
            thePasteboard's declareTypes:{"NSFilenamesPboardType"} owner:missing value

            -- Write the path array to the pasteboard
            thePasteboard's setPropertyList:theArray forType:"NSFilenamesPboardType"

            return "success"
        on error errMsg
            return "error: " & errMsg
        end try
      `;

      const child = cp.spawn('osascript', ['-e', script]);

      let stderrData = '';
      let stdoutData = '';

      child.stdout.on('data', (data) => { stdoutData += data.toString(); });
      child.stderr.on('data', (data) => { stderrData += data.toString(); });

      child.on('close', (code) => {
        if (code === 0 && stdoutData.trim().includes("success")) {
          vscode.window.setStatusBarMessage(`📎 File object copied! (Mac)`, 4000);
        } else {
          const errorMsg = stderrData || stdoutData || "Unknown error";
          vscode.window.showErrorMessage(`Copy failed. Error: ${errorMsg}`);
        }
      });

    } else if (platform === 'win32') {
      // [Windows] PowerShell
      const command = `powershell -command "Set-Clipboard -Path '${targetPath}'"`;
      cp.exec(command, (error) => {
        if (error) {
          vscode.window.showErrorMessage(`Copy failed: ${error.message}`);
          return;
        }
        vscode.window.setStatusBarMessage(`📎 File object copied! (Windows)`, 4000);
      });

    } else if (platform === 'linux') {
      // [Linux] xclip
      const fileUri = vscode.Uri.file(targetPath).toString();
      const checkXclip = "which xclip";
      const copyCommand = `printf "${fileUri}" | xclip -selection clipboard -t text/uri-list`;

      cp.exec(checkXclip, (error) => {
        if (error) {
          vscode.window.showErrorMessage("Linux requires 'xclip' installed. (sudo apt install xclip)");
          return;
        }
        cp.exec(copyCommand, (copyError) => {
          if (copyError) {
             vscode.window.showErrorMessage(`Copy failed: ${copyError.message}`);
             return;
          }
          vscode.window.setStatusBarMessage(`📎 File object copied! (Linux)`, 4000);
        });
      });

    } else {
      vscode.window.showErrorMessage("This OS is not supported.");
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
