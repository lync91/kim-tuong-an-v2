import React from "react";
import { renderToString } from "react-dom/server";
import TemplatePhieu from "../components/template";
import { html } from "./htmlstring";
import { remote } from "electron";
import CmndPage from "./Template/CmndPage";
import { ipcRenderer } from "electron";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { print } from "pdf-to-printer";
const PDFWindow = require("electron-pdf-window");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const isDev = true;

const { BrowserWindow } = remote;

const bwipjs = remote.require("bwip-js");

const options = {
  // silent: true,
  // deviceName: "Canon LBP2900",
  printBackground: isDev ? false : true,
  color: false,
  margin: {
    marginType: "printableArea",
  },
  landscape: false,
  pagesPerSheet: 1,
  collate: false,
  copies: 1,
};
export function printPreview(data, preview) {
  console.log(data);
  const win = new BrowserWindow({
    show: preview,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const barOptions = {
    bcid: "code128", // Barcode type
    text: data.sophieu, // Text to encode
    scale: 2, // 3x scaling factor
    height: 20, // Bar height, in millimeters
    includetext: false, // Show human-readable text
    textxalign: "center", // Always good to set this f
  };

  bwipjs.toBuffer(barOptions, function (err, png) {
    if (err) {
      console.log(err);
    } else {
      const src = "data:image/png;base64," + png.toString("base64");
      const htmlString = renderToString(
        <TemplatePhieu data={{ ...data, ...{ src: src } }} />
      );

      const finalHtml = html.replace("{body}", htmlString);
      let list = win.webContents.getPrinters();
      console.log("All printer available are ", list);

      win.loadURL(`data:text/html,${encodeURIComponent(finalHtml)}`);
      if (!preview)
        win.webContents.on("did-finish-load", () => {
          win.webContents.print(options, (success, failureReason) => {
            if (!success) console.log(failureReason);
            console.log("Print Initiated");
          });
        });
    }
  });
}

export async function printCmnd(data) {
  const { img1, img2 } = data;
  console.log(data);
  console.log("OK");
  const win = new BrowserWindow({
    show: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const docDefinition = {
    pageSize: "A5",

    // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: "landscape",
    content: [
      {
        alignment: "justify",
        columns: [
          {
            stack: [
              {
                image: img1,
                width: 200,
              },
            ],
          },
          {
            stack: [
              {
                image: img2,
                width: 200,
                alignment: "right",
              },
            ],
          },
        ],
      },
    ],
  };

  // pdfMake.createPdf(docDefinition).print(options);

  //Option 1

  // const htmlString = renderToString(<CmndPage data={data} />);

  // const finalHtml = html.replace("{body}", htmlString);
  // let list = win.webContents.getPrinters();
  // console.log("All printer available are ", list);

  // const fpath = await ipcRenderer.invoke("saveTempHtml", finalHtml);

  // win.loadFile(fpath);
  // win.webContents.on("did-finish-load", () => {
  //   win.webContents.print(options, (success, failureReason) => {
  //     if (!success) console.log(failureReason);
  //     console.log("Print Initiated");
  //     ipcRenderer.invoke("deleteTmp", fpath);
  //   });
  // });

  //Option 2

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBuffer(async (data) => {
    const pathFile = await ipcRenderer.invoke("saveTempPdf", data);
    // win.loadFile(pathFile);
    // win.webContents.on("did-finish-load", () => {
    //   win.webContents.print(options, (success, failureReason) => {
    //     if (!success) console.log(failureReason);
    //     console.log("Print Initiated");
    //     ipcRenderer.invoke("deleteTmp", pathFile);
    //   });
    // });
    print(pathFile).then(console.log);
  });
}
