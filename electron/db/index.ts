import * as isDev from "electron-is-dev";
import * as path from "path";
import knex from "./connect";
import { ipcMain, dialog } from "electron";
import * as ExcelJS from "exceljs";
import * as moment from "moment";
import * as fs from "fs";
import { filePath } from "./connect";
import { map, queue } from "async";

import * as settings from "electron-settings";
import initdb, { createLoaiTaiSan, dropTable, createCamDo, createBotData } from "./init";
const readXlsxFile = require("read-excel-file/node");

ipcMain.handle("createCamdo", async (event) => {
  console.log("OK");
  
  const res = await dropTable('camdo');
  createCamDo();
});

ipcMain.handle("getdataPath", async (e) => {
  return filePath;
});
ipcMain.handle("getLastId", async (event) => {
  const result = await knex("camdo").max({ a: "id" });
  return result[0];
});
ipcMain.handle("getNhatky", async (event, id) => {
  const result = await knex("nhatky").where("phieu", id);
  return result;
});
ipcMain.handle("getSettings", async (event) => {
  const result = await knex("settings").where("id", 1);
  return result[0];
});
ipcMain.handle("setSettings", async (e, v) => {
  const result = await knex("settings").where("id", 1).update(v);
  return result;
});
ipcMain.handle("getdata", async (event) => {
  const result = await knex("camdo").orderBy("id", "desc").select();
  return result;
});
ipcMain.handle("chuoc", async (event, data) => {
  const result = await knex("camdo").where("id", "=", data.id).update(data);
  return result;
});
ipcMain.handle("phieubyId", async (event, id) => {
  const result = await knex("camdo").where("id", "=", id);
  return result[0];
});
ipcMain.handle("updateCamdo", async (event, data) => {
  const result = await knex("camdo").where("id", "=", data.id).update(data);
  return result;
});
ipcMain.handle("giahanCamDo", async (event, data) => {
  const result = await knex("camdo").where("id", "=", data.id).update(data);
  const res = await knex("nhatky")
    .insert({
      phieu: data.id,
      hoatdong: "Đóng lãi",
      thoigian: data.ngaytinhlai,
      noidung: `Tiền lãi: ${data.tienlai}`,
    })
    .then();
  return res;
});
ipcMain.handle("camThemTien", async (event, data, tiencamthem, laidukien) => {
  const result = await knex("camdo").where("id", "=", data.id).update(data);
  // tiencamthem
  await knex("nhatky")
    .insert({
      phieu: data.id,
      hoatdong: "Cầm thêm",
      thoigian: data.ngaytinhlai,
      noidung: `Tiền cầm thêm: ${tiencamthem}; Tiền lãi: ${laidukien}`,
    })
    .then();
  return result;
});
ipcMain.handle("insertCamdo", async (event, data) => {
  const result = await knex("camdo").insert(data).then();
  return result;
});
ipcMain.handle("backupData", async (event, data) => {
  const fileData = path.parse(filePath);
  fs.copyFile(
    filePath,
    path.join(fileData.dir, `backup-${new Date().getTime()}${fileData.ext}`),
    (err) => {
      if (err) throw err;
      console.log("source.txt was copied to destination.txt");
    }
  );
});
ipcMain.handle("excelExport", async (event, filePath, data) => {
  console.log(data);
  const tableData = data.map((e: any) => [
    e.id,
    e.sophieu,
    e.tenkhach,
    e.monhang,
    e.loaivang,
    e.tongtrongluong,
    e.trongluonghot,
    e.trongluongthuc,
    e.gianhap,
    e.tiencam,
    e.laisuat,
    e.tienlai,
    e.tienchuoc,
    e.ngaycam ? new Date(moment(e.ngaycam).format("YYYY-MM-DD")) : "",
    e.ngaycam ? moment(e.ngaycam).format("HH:mm") : "",
    e.ngayhethan ? new Date(moment(e.ngayhethan).format("YYYY-MM-DD")) : "",
    e.ngaytinhlai ? new Date(moment(e.ngaytinhlai).format("YYYY-MM-DD")) : "",
    e.ngaytinhlai ? moment(e.ngaytinhlai).format("HH:mm") : "",
    e.ngaychuoc ? new Date(moment(e.ngaychuoc).format("YYYY-MM-DD")) : "",
    e.ngaychuoc ? moment(e.ngaychuoc).format("HH:mm") : "",
    e.dachuoc,
    e.tudo,
    e.dahuy,
  ]);

  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet("data");
  ws.getColumn(9).numFmt = "#,##0";
  ws.getColumn(10).numFmt = "#,##0";
  ws.getColumn(12).numFmt = "#,##0";
  ws.getColumn(13).numFmt = "#,##0";
  ws.getColumn(2).width = 11;
  ws.getColumn(4).width = 11;
  ws.getColumn(9).width = 11;
  ws.getColumn(10).width = 11;
  ws.getColumn(12).width = 11;
  ws.getColumn(13).width = 11;
  ws.getColumn(14).width = 11;
  ws.getColumn(16).width = 11;
  ws.getColumn(17).width = 11;
  ws.getColumn(19).width = 11;
  ws.addTable({
    name: "Data",
    ref: "A1",
    headerRow: true,
    totalsRow: true,
    style: {
      theme: "TableStyleLight16",
      showRowStripes: true,
    },
    columns: [
      { name: "ID", totalsRowLabel: "Tổng:", filterButton: true },
      { name: "Số phiếu", totalsRowFunction: "count", filterButton: true },
      { name: "Tên khác", totalsRowFunction: "sum", filterButton: true },
      { name: "Món hàng", totalsRowFunction: "sum", filterButton: true },
      { name: "Loại vàng", totalsRowFunction: "sum", filterButton: true },
      { name: "Tổng", totalsRowFunction: "sum", filterButton: true },
      { name: "Hột", totalsRowFunction: "sum", filterButton: true },
      { name: "Thực", totalsRowFunction: "sum", filterButton: true },
      { name: "Giá nhập", totalsRowFunction: "sum", filterButton: true },
      { name: "Tiền cầm", totalsRowFunction: "sum", filterButton: true },
      { name: "Lãi suất", totalsRowFunction: "sum", filterButton: true },
      { name: "Tiền lãi", totalsRowFunction: "sum", filterButton: true },
      { name: "Tiền chuộc", totalsRowFunction: "sum", filterButton: true },
      { name: "Ngày cầm", totalsRowFunction: "sum", filterButton: true },
      { name: "Giờ cầm", totalsRowFunction: "sum", filterButton: true },
      { name: "Ngày hết hạn", totalsRowFunction: "sum", filterButton: true },
      { name: "Ngày tính lãi", totalsRowFunction: "sum", filterButton: true },
      { name: "Giờ tính lãi", totalsRowFunction: "sum", filterButton: true },
      { name: "Ngày chuộc", totalsRowFunction: "sum", filterButton: true },
      { name: "Giờ chuộc", totalsRowFunction: "sum", filterButton: true },
      { name: "Đã chuộc", totalsRowFunction: "sum", filterButton: true },
      { name: "Tủ đồ", totalsRowFunction: "sum", filterButton: true },
      { name: "Đã hủy", totalsRowFunction: "sum", filterButton: true },
    ],
    rows: tableData,
  });
  await workbook.xlsx.writeFile(filePath);
});

ipcMain.handle("createNhatKy", async () => {
  knex.schema
    .createTable("nhatky", (table: any) => {
      table.increments("id");
      table.integer("phieu");
      table.integer("thoigian");
      table.integer("hoatdong");
      table.integer("noidung");
      table.timestamps();
    })
    .then((rows: any) => {
      console.log(rows);
    });
});

ipcMain.handle("addColDo", async (event) => {
  return await knex.schema.table("camdo", (table: any) => {
    table.float("do");
  });
});

ipcMain.handle("openExcel", async () => {
  const dialogRes = await dialog.showOpenDialog({ properties: ["openFile"] });
  if (dialogRes.canceled) return null;
  if (dialogRes.filePaths.length > 0) {
    console.log(dialogRes.filePaths[0]);
    const sheetNames = await readXlsxFile.readSheetNames(
      dialogRes.filePaths[0]
    );
    const filePath = dialogRes.filePaths[0];
    return { sheetNames, filePath };
  }
});
ipcMain.handle("readExcel", async (event, path, sheet) => {
  return await readXlsxFile(path, { sheet });
});

const convertDateNum = (value: any) => {
  if (!value) return null;
  if (value === "null") return null;
  if (/(([0-9]{2}\/){2}[0-9]{4})/g.test(value))
    return moment(value, "DD/MM/YYYY").isValid()
      ? moment(value, "DD/MM/YYYY").format("x")
      : null;
  return moment(value).isValid() ? moment(value).format("x") : null;
};

var q = queue(async (e: any, callback) => {
  const ngaynhap = convertDateNum(e.ngaynhap) || null;
  const ngayban = convertDateNum(e.ngayban) || null;
  const rows: any[] = await knex("dotu").where("ma", e.ma);
  const { ma, kyhieu, ten, loaivang, ncc, trongluong, tiencong } = e;
  if (rows.length > 0) {
    const res = await knex("dotu")
      .update({ ma, kyhieu, ten, loaivang, ncc, trongluong, tiencong, ngayban, ngaynhap })
      .where("ma", e.ma);
    callback({...e, status: "daco"});
  } else {
    // event.reply("importProgress", { hientai, status: "danhap" });
    const res = await knex("dotu").insert({ ma, kyhieu, ten, loaivang, ncc, trongluong, tiencong, ngayban, ngaynhap });
    callback({...e, status: "danhap"});
  }
  // callback();
}, 1);

ipcMain.on("importData", async (event, data: any[]) => {
  q.push(data, function (res) {
		event.reply('importProgress', {...res, total: data.length});
  });
  // let hientai = 1;
  // const _importData = async (e: any, cb: any) => {
  //   hientai += 1;
  //   const ngaynhap = convertDateNum(e.ngaynhap) || null;
  //   const ngayban = convertDateNum(e.ngayban) || null;
  //   // if (i === data.length - 1) event.reply('importComplate')
  //   const rows: any[] = await knex("dotu").where("ma", e.ma);
  //   if (rows.length > 0) {
  //     delete e.id;
  //     event.reply("importProgress", { hientai, status: "daco" });
  //     const res = await knex("dotu")
  //       .update({ ...e, ...{ ngayban, ngaynhap } })
  //       .where("ma", e.ma);
  //     cb(res);
  //   } else {
  //     event.reply("importProgress", { hientai, status: "danhap" });
  //     const res = await knex("dotu").insert({ ...e, ...{ ngayban, ngaynhap } });
  //     cb(res);
  //   }
  // };
});

ipcMain.handle("spByMa", async (event, ma) => {
  const sp: any[] = await knex("dotu").where({ ma }).select();
  return sp[0];
});

ipcMain.handle("setGia", async (event, data) => {
  return await settings.set("gia", data);
});
ipcMain.handle("getGia", async (event, data) => {
  return await settings.get("gia");
});
ipcMain.handle("createDotu", async (event, data) => {
  return await initdb.createDotu();
});
ipcMain.handle("getDataDotu", async (event) => {
  return await knex("dotu").select();
});

function test() {
  const { exec } = require("child_process");
  exec("wmic printer list brief", (err: any, stdout: any, stderr: any) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
    // list of printers with brief details
    console.log(stdout);
    // the *entire* stdout and stderr (buffered)
    stdout = stdout.split("  ");
    var printers = [];
    let j = 0;
    stdout = stdout.filter((item: any) => item);
    for (let i = 0; i < stdout.length; i++) {
      if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
        printers[j] = stdout[i + 1];
        j++;
      }
    }
    // list of only printers name
    console.log(printers);
    console.log(stderr);
  });
}

ipcMain.handle('createLoaiTaiSan', async (event) => {
  return await createLoaiTaiSan();
});

ipcMain.handle('getLoaiTaiSan', async (event) => {
  return await knex('loaitaisan').select();
})

ipcMain.handle('addLoaiTaiSan', async (event) => {
  const _id = await knex('loaitaisan').insert({
    loaitaisan: "",
    laisuat: 5
  });
  if (_id[0]) return await knex('loaitaisan').select();
});

ipcMain.handle('updateLoaiTaiSan', async (event, row) => {
  return await knex('loaitaisan').where("id", "=", row.id).update(row);
});

ipcMain.handle('getBaremChuyentien', async (event) => {
  return await settings.get('baremChuyenTien')
});

ipcMain.handle('setBaremChuyentien', async (event, data) => {
  return await settings.set('baremChuyenTien', data);
})

ipcMain.handle('getBaremRuttien', async (event) => {
  return await settings.get('baremRutTien')
});

ipcMain.handle('setBaremRuttien', async (event, data) => {
  return await settings.set('baremRutTien', data);
})

ipcMain.handle('createBotData', async () => {
  return await createBotData();
})

ipcMain.handle('getBotData', async (event) => {
  return await knex('botdata').where("type", "=", "photo").orderBy('id', 'desc').select();
});

export const tmpPath = isDev
  ? path.join(__dirname, "..", "..", "..", "tmp")
  : path.join(__dirname, "..", "..", "..", "..", "tmp");

ipcMain.handle('saveTempPdf', async (event, buff) => {
  console.log('ok');
  
  const fname = moment().format('X');
  const fpath = path.join(tmpPath, `${fname}.pdf`)
  console.log(fpath);
  
  await fs.writeFileSync(fpath, buff);
  return fpath;
});

ipcMain.handle('deleteTmp', async (event, filePath) => {
  return await fs.unlinkSync(filePath);
})