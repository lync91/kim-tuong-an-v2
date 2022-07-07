import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
// import * as google from 'googleapis';
import "./db/index";
import { queue } from "async";
import * as moment from "moment";
import knex from "./db/connect";
// import * as db from './db'

// const CLIENT_ID = '1044766700247-rfe3l68b7qemqldun17q5qrq1evi5pai.apps.googleusercontent.com'

//client secret
// const CLIENT_SECRET = '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';

const convertDateNum = (value: any) => {
  if (!value) return null;
  if (value === "null") return null;
  if (/(([0-9]{2}\/){2}[0-9]{4})/g.test(value))
    return moment(value, "DD/MM/YYYY").isValid()
      ? moment(value, "DD/MM/YYYY").format("x")
      : null;
  return moment(value).isValid() ? moment(value).format("x") : null;
};

let win;
let winGia: any;



function createWindow() {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    maximizable: true,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      plugins: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.setMenuBarVisibility(false);
  win.maximize();
  // win.setTitle('Kim Tường An');
  let webContents = win.webContents;
  webContents.on("did-finish-load", () => {
    if (isDev) {
      // webContents.setZoomFactor(0.575)
    } else {
      // webContents.setZoomFactor(1)
    }
    // webContents.setVisualZoomLevelLimits(1, 1)
  });
  if (isDev) {
    win.loadURL("http://localhost:3000/index.html");
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }

  if (isDev) {
    win.webContents.openDevTools();
  }

  ipcMain.handle("openBangGia", (event) => {
    winGia = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        plugins: true,
        nodeIntegration: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    // global.win = winGia;

    
  
    // Load a remote URL
    // winGia.loadURL('/banggia')
  
    if (isDev) {
      winGia.loadURL("http://localhost:3000/index.html#banggia/true");
    } else {
      // 'build/index.html'
      winGia.loadURL(`file://${__dirname}/../index.html#banggia/true`);
    };
  });
};

ipcMain.handle('doScanned', (event, data) => {
  winGia.webContents.send('doScanned', data);
})

app.commandLine.appendSwitch("disable-pinch");

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
