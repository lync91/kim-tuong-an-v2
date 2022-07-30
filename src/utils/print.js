import React from "react";
import { renderToString } from "react-dom/server";
import TemplatePhieu from "../components/template";
import { html } from "./htmlstring";
import { remote } from "electron";
import CmndPage from "./Template/CmndPage";

import { print } from "pdf-to-printer";


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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

export function printCmnd(data) {
  const {img1, img2} = data;
  console.log(data);
  console.log("OK");
  const win = new BrowserWindow({
    show: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // const htmlString = renderToString(
  //   <CmndPage data={data} />
  // );
  // const finalHtml = html.replace("{body}", htmlString).replace(/\s{2,}/g, '')   // <-- Replace all consecutive spaces, 2+
  // .replace(/%/g, '%25')     // <-- Escape %
  // .replace(/&/g, '%26')     // <-- Escape &
  // .replace(/#/g, '%23')     // <-- Escape #
  // .replace(/"/g, '%22')     // <-- Escape "
  // .replace(/'/g, '%27')
  // console.log(finalHtml);

  const docDefinition = {
    content: [
      {
        alignment: 'justify',
        columns: [
          {
            image: img1,
            width: 200,
          },
          {
            image: img1,
            width: 200,
          },
        ]
      },
      
    ],
  };

  // pdfMake.createPdf(docDefinition).print(options);
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getDataUrl((data) => {
    // alert(data);
    // win.loadURL(data);
    // win.webContents.on("did-finish-load", () => {
    //   win.webContents.print(options, (success, failureReason) => {
    //     if (!success) console.log(failureReason);
    //     console.log("Print Initiated");
    //   });
    // });

    print("data").then(console.log);


  });
}
