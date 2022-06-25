import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import "./db/index";

const ioHook = require('iohook');
ioHook.on("keypress", (event: any) => {
  console.log(event);
  // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keypress'}
});
ioHook.start();

// import { GlobalKeyboardListener } from "node-global-key-listener";
// const v = new GlobalKeyboardListener();

// let code = "";
// let reading = false;

// //Log every key that's pressed.
// const calledOnce = function (e: any, down: any) {
//   console.log(e.name, JSON.stringify(down));
  
//   if (e.state !== "DOWN") return;
//   // console.log(`${JSON.stringify(e)}`);
//   //usually scanners throw an 'Enter' key at the end of read
//   if (e.name === "RETURN") {
//     if (code.length > 10) {
//       console.log(code);
//       /// code ready to use
//       code = "";
//     }
//     v.removeListener(calledOnce);
//     v.addListener(calledOnce);
//   } else {
//     code += e.name; //while this is not an 'enter' it stores the every key
//   }

//   //run a timeout of 200ms at the first read and clear everything
//   if (!reading) {
//     reading = true;
//     setTimeout(() => {
//       code = "";
//       reading = false;
//     }, 200); //200 works fine for me but you can adjust it
//   }
//   // v.removeListener(calledOnce);
//   // return true;
// };


// import * as google from 'googleapis';
// import * as db from './db'

// const CLIENT_ID = '1044766700247-rfe3l68b7qemqldun17q5qrq1evi5pai.apps.googleusercontent.com'

//client secret
// const CLIENT_SECRET = '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';

function createWindow() {
  const win = new BrowserWindow({
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
}

app.commandLine.appendSwitch("disable-pinch");

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();
  // v.addListener(calledOnce);

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
