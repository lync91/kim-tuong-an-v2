import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import { createWorker } from "tesseract.js";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
// import * as google from 'googleapis';
import "./db/index";
import knex from "./db/connect";
import * as moment from "moment";

// import "./bot";

// import * as db from './db'

// const CLIENT_ID = '1044766700247-rfe3l68b7qemqldun17q5qrq1evi5pai.apps.googleusercontent.com'

//client secret
// const CLIENT_SECRET = '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';

export const langPath = isDev
  ? path.join(__dirname, "..", "..", "lang-data")
  : path.join(__dirname, "..", "..", "..", "lang-data");

export const photoPath = isDev
  ? path.join(__dirname, "..", "..", "photo")
  : path.join(__dirname, "..", "..", "..", "photo");

const worker = createWorker({
  cachePath: langPath,
  logger: (m) => console.log(m),
});

// (async () => {
//   await worker.load();
//   await worker.loadLanguage('vie');
//   await worker.initialize('vie');
//   const { data: { text } } = await worker.recognize(path.join(__dirname, '..', '..', 'electron','images', 'test1.jpg'));
//   console.log(text);
//   await worker.terminate();
// })();

//Create Telegram Bot

const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = "5403728149:AAHu6jrVbtHx_HIrqv4uO7VnQg15xbvLWqU";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg: any, match: any) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.

let win: any;
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

    if (isDev) {
      winGia.loadURL("http://localhost:3000/index.html#banggia/true");
    } else {
      // 'build/index.html'
      winGia.loadURL(`file://${__dirname}/../index.html#banggia/true`);
    }
  });
}

ipcMain.handle("doScanned", (event, data) => {
  winGia.webContents.send("doScanned", data);
});

// Handle Bot Mess

bot.on("message", async (msg: any) => {
  const chatId = msg.chat.id;
  // console.log(msg);
  const { photo, text }: { photo: any[]; text: string; id: number } = msg;
  const {
    message_id,
    from: { id, first_name, last_name },
    date,
  } = msg;
  let data = {
    date,
    message_id,
    from_id: id,
    from_first_name: first_name,
    from_last_name: last_name,
    text: text ? text : "",
    // photo_link: photoLink || null,
    type: photo ? "photo" : "text",
  };
  if (photo) {
    const e = photo[photo.length - 1];
    const photo_link = await bot.getFileLink(e.file_id);
    data = { ...data, ...{ photo_link: photo_link || null } };
    const res = await bot.downloadFile(e.file_id, photoPath);
    console.log(res);
    // await worker.load();
    // await worker.loadLanguage("vie");
    // await worker.initialize("vie");
    // const {
    //   data: { text },
    // } = await worker.recognize(
    //   photo_link
    // );
    // console.log(text);
    // await worker.terminate();
  }
  // console.log(data);

  const res = await knex("botdata").insert(data);
  win.webContents.send("newBotMessage", res);

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
  win.webContents.send("newBotMessage");
});

app.commandLine.appendSwitch("disable-pinch");

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  // createWindow();
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }
    });

    // Create win, load the rest of the app, etc...
    app.whenReady().then(() => {
      createWindow();
    });
  }

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
