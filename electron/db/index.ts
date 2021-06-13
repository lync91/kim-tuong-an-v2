import knex from "./connect";
import { ipcMain } from "electron";

ipcMain.handle('getdata', async (event) => {
	const result = await knex('camdo').select();
	return result
});