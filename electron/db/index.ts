import * as isDev from 'electron-is-dev';
import * as path from 'path';
import knex from "./connect";
import { ipcMain } from "electron";
import * as ExcelJS from "exceljs";
import * as moment from "moment";
import * as fs from "fs";
import {filePath} from "./connect"

ipcMain.handle('getdataPath', async(e) => {
	return filePath
})
ipcMain.handle('getListTenKhach', async (event) => {
	const result = await knex('camdo').distinct('tenkhach');
	return result;
});
ipcMain.handle('groupByTenKhach', async (event) => {
	const result = await knex('camdo')
	.select('*')
	.sum({ totaltiencam: 'tiencam', totaltienlai: 'tienlai', totaltienchuoc: 'tienchuoc' })
	.groupBy('tenkhach');
	return result;
});
ipcMain.handle('getLastId', async (event) => {
	const result = await knex('camdo').max({ a: 'id' });
	return result[0];
});
ipcMain.handle('getSettings', async (event) => {
	const result = await knex('settings').where('id', 1);
	return result[0];
});
ipcMain.handle('setSettings', async (e, v) => {
	const result = await knex('settings')
	    .where('id', 1)
	    .update(v)
	return result;
})
ipcMain.handle('getdata', async (event) => {
	const result = await knex('camdo').orderBy('id', 'desc').select();
	return result;
});
ipcMain.handle('chuoc', async (event, data) => {
	const result = await knex('camdo')
		.where('id', '=', data.id)
		.update(data);
	return result;
});
ipcMain.handle('phieubyId', async (event, id) => {
	const result = await knex('camdo')
		.where('id', '=', id)
	return result[0];
});
ipcMain.handle('phieubySoPhieu', async (event, sophieu) => {
	const result = await knex('camdo')
		.where('sophieu', '=', sophieu)
	return result[0];
});
ipcMain.handle('updateCamdo', async (event, data) => {
	const result = await knex('camdo')
	  .where('id', '=', data.id)
	  .update(data)
	return result;
});
ipcMain.handle('giahanCamDo', async (event, data) => {
	const result = await knex('camdo')
	  .where('id', '=', data.id)
	  .update(data)
	return result;
});
ipcMain.handle('camThemTien', async (event, data) => {
	const result = await knex('camdo')
    .where('id', '=', data.id)
    .update(data);
	return result;
});
ipcMain.handle('insertCamdo', async (event, data) => {
	const result = await knex('camdo').insert(data).then();
	return result;
});
ipcMain.handle('backupData', async (event, data) => {
	const fileData = path.parse(filePath);
	fs.copyFile(filePath, path.join(fileData.dir, `backup-${new Date().getTime()}${fileData.ext}`), (err) => {
		if (err) throw err;
		console.log('source.txt was copied to destination.txt');
	});
});
ipcMain.handle('excelExport', async (event, filePath, data) => {
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
		e.ngaycam ? new Date(moment(e.ngaycam).format('YYYY-MM-DD')) : "",
		e.ngaycam ? moment(e.ngaycam).format('HH:mm') : "",
		e.ngayhethan ? new Date(moment(e.ngayhethan).format('YYYY-MM-DD')) : "",
		e.ngaytinhlai ? new Date(moment(e.ngaytinhlai).format('YYYY-MM-DD')) : "",
		e.ngaytinhlai ? moment(e.ngaytinhlai).format('HH:mm') : "",
		e.ngaychuoc ? new Date(moment(e.ngaychuoc).format('YYYY-MM-DD')) : "",
		e.ngaychuoc ? moment(e.ngaychuoc).format('HH:mm') : "",
		e.dachuoc,
		e.tudo,
		e.dahuy
	])
	
	const workbook = new ExcelJS.Workbook();
	const ws = workbook.addWorksheet('data');
	ws.getColumn(9).numFmt = '#,##0';
	ws.getColumn(10).numFmt = '#,##0';
	ws.getColumn(12).numFmt = '#,##0';
	ws.getColumn(13).numFmt = '#,##0';
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
		name: 'Data',
		ref: 'A1',
		headerRow: true,
		totalsRow: true,
		style: {
			theme: 'TableStyleLight16',
			showRowStripes: true,
		},
		columns: [
			{name: 'ID', totalsRowLabel: 'Tổng:', filterButton: true},
			{name: 'Số phiếu', totalsRowFunction: 'count', filterButton: true},
			{name: 'Tên khác', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Món hàng', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Loại vàng', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Tổng', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Hột', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Thực', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Giá nhập', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Tiền cầm', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Lãi suất', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Tiền lãi', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Tiền chuộc', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Ngày cầm', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Giờ cầm', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Ngày hết hạn', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Ngày tính lãi', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Giờ tính lãi', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Ngày chuộc', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Giờ chuộc', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Đã chuộc', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Tủ đồ', totalsRowFunction: 'sum', filterButton: true},
			{name: 'Đã hủy', totalsRowFunction: 'sum', filterButton: true},
		],
		rows: tableData,
	});
	await workbook.xlsx.writeFile(filePath);
})