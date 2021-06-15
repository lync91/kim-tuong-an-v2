import knex from "./connect";
import { ipcMain } from "electron";

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