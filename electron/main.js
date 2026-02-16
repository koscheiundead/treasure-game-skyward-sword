const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require('child_process');

let pythonProcess = null;

function startPythonBackend() {
  //for dev, we point this locally
  const scriptPath = path.join(__dirname, '..', 'backend', 'app.py');

  pythonProcess = spawn('python', [scriptPath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data}`);
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  })
}

async function createWindow() {
  startPythonBackend();

  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:5173').catch((err) => {
    console.error('Failed to load URL:', err);
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (${errorCode})`);
  });
}

app.on('will-quit', () => {
  if (pythonProcess !== null) {
    console.log("Killing Python process...");
    pythonProcess.kill("SIGINT"); // a friendly interrupt signal
    pythonProcess = null;
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  setTimeout(() => {
    createWindow().catch((err) => {
      console.error('Failed to create window:', err);
    });
  }, 2000);
});
