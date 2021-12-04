import * as isDev from 'electron-is-dev';
import * as path from 'path';
import knex from "./connect";
import { ipcMain } from "electron";
import * as ExcelJS from "exceljs"

ipcMain.handle('getdataPath', async(e) => {
	const filePath = isDev ? path.join(__dirname, '..', '..', '..', 'data/database.sqlite') : path.join(__dirname, '..', '..', '..', '..', '/data/database.sqlite');
	return filePath
})
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
ipcMain.handle('excelExport', async (event, data) => {
	console.log('OK');
	
	const workbook = new ExcelJS.Workbook();
	const ws = workbook.addWorksheet('data');
	ws.addTable({
		name: 'MyTable',
		ref: 'A1',
		headerRow: true,
		totalsRow: true,
		style: {
			theme: 'TableStyleDark3',
			showRowStripes: true,
		},
		columns: [
			{name: 'Date', totalsRowLabel: 'Totals:', filterButton: true},
			{name: 'Amount', totalsRowFunction: 'sum', filterButton: false},
		],
		rows: [
			[new Date('2019-07-20'), 70.10],
			[new Date('2019-07-21'), 70.60],
			[new Date('2019-07-22'), 70.10],
		],
	});
	await workbook.xlsx.writeFile("test.xlsx");
})