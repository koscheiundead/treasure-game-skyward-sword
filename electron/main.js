const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require('child_process');

const pythonProcess = spawn('python', ['../backend/app.py']);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173"); //vite dev server
}

app.whenReady().then(createWindow);
