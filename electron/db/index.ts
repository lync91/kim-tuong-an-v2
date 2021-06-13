import knex from "./connect";
import { ipcMain } from "electron";

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