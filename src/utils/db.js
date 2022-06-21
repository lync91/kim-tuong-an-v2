import { ipcRenderer } from 'electron';
import moment from 'moment';
import { round } from 'mathjs';

export function getLastId() {
  return ipcRenderer.invoke('getLastId')
}
export function insertCamdo(data) {
  return ipcRenderer.invoke('insertCamdo', data);
}
export function updateCamDo(data) {
  return ipcRenderer.invoke('updateCamdo', data);
}
export function giahanCamDo(id, tienlai, ngaytinhlai, songay) {
  let data = {
    id: id,
    ngaytinhlai: ngaytinhlai.format('x'),
    ngayhethan: ngaytinhlai.add(Number(songay), 'days').format('x'),
    tienlai: tienlai
  };
  console.log(data);
  return ipcRenderer.invoke('giahanCamDo', data)
  // knex('camdo')
  //   .where('id', '=', id)
  //   .update(data)
  //   .then(res => fn(res));
  // knex('giahan')
  //   .insert({
  //     sophieu: id,
  //     ngaytinhlai: moment().format('x'),
  //     ngayhethan: moment().add(songay, 'days').format('x')
  //   })
  //   .then((res) => console.log(res));
}
export function camThemTien(id, tienlai, tiencam, tiencamthem) {
  let data = {
    id: id,
    tienlai: tienlai,
    tiencam: tiencam,
    ngaytinhlai: moment().format('x'),
    ngayhethan: moment().add(30, 'days').format('x'),
    
  };
  return ipcRenderer.invoke('camThemTien', data, tiencamthem);
}
export function chuocDo(id, tienlai, tienchuoc, ngaychuoc) {
  let data = {
    id: id,
    tienlai: tienlai,
    tienchuoc: tienchuoc,
    ngaychuoc: ngaychuoc,
    dachuoc: 1
  };
  console.log(id, data);
  return ipcRenderer.invoke('chuoc', data)
}
export function getCamDo(key, fn) {
  // const camdo = knex('camdo').select()
    // .orderBy('id', 'desc')
  // if (key === 'tatca') camdo
    // .then(res => fn(res.map((v) => {
    //   v.ngaycam = moment(v.ngaycam).format('DD/MM/YYYY');
    //   v.ngaytinhlai = moment(v.ngaytinhlai).format('DD/MM/YYYY')
    //   v.ngayhethan = moment(v.ngayhethan).format('DD/MM/YYYY');
    //   v.ngaychuoc = v.ngaychuoc ? moment(v.ngaychuoc).format('DD/MM/YYYY') : '';
    //   v.tiencam = v.tiencam ? `${v.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
    //   v.tienlai = v.tienlai ? `${v.tienlai}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
    //   v.tienchuoc = v.tienchuoc ? `${v.tienchuoc}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
    //   v.trangthai = v.dachuoc > 0 ? 'Đã chuôc' : 'Chưa chuộc';
    //   v.trongluongthuc = v.trongluongthuc ? round(v.trongluongthuc, 3) : ''
    //   return v
    // })));
    // .then(res => fn(res))
  // if (key === 'conhan') camdo.whereRaw(
  //   'ngayhethan > ? and dachuoc <= ? and dahuy > ?',
  //   [moment().format('x'), 0, 0]
  // ).then(res => fn(res))
  // if (key === 'quahan') camdo.whereRaw(
  //   'ngayhethan < ? and dachuoc <= ? and dahuy > ?',
  //   [moment().format('x'), 0, 0]
  // ).then(res => fn(res))
  // if (key === 'dachuoc') camdo.whereRaw('dachuoc > ? and dahuy > ?', [0, 0]).then(res => fn(res))

}
export function deleteCamDo(id, fn) {
  // knex('camdo')
  //   .where('id', id)
  //   .del()
  //   .then(res => fn(res));
}
export function huyPhieuCam(id, fn) {
  // knex('camdo')
  //   .where('id', id)
  //   .update({ dahuy: 1 })
  //   .then(res => fn(res));
}
export function timPhieu(sophieu, fn) {
  // knex('camdo')
  //   .where('sophieu', sophieu)
  //   .then(res => fn(res));
}
export function timPhieubyID(id) {
  return ipcRenderer.invoke('phieubyId', id)
}
export function timKiem(text, fn) {
  // const dateNumber = moment(text, 'DD/MM/YYYY').format('X').toString().substring(0, 5);
  // console.log(dateNumber);
  // const camdo = knex('camdo');
  // camdo.whereRaw(`id = '${text}' or sophieu like '%${text}%' or tenkhach like '%${text}%' or ngaycam like '%${dateNumber}%' or tudo = '${text}'`)
  //   .then(res => fn(res));
}
export function timTudo(text, fn) {
  // const dateNumber = moment(text, 'DD/MM/YYYY').format('X').toString().substring(0, 5);
  // console.log(dateNumber);
  // const camdo = knex('camdo');
  // camdo.whereRaw(`tudo = '${text}'`)
  //   .then(res => fn(res));
}
export function createSettings() {
  // db.initdb.dropTable('settings')
  //   .then(e => db.initdb.createSettings())
  //   .then(e => db.initdb.createSettingsDetails())
  //   .catch(e => {
  //     db.initdb.createSettings()
  //       .then(e => db.initdb.createSettingsDetails())
  //   })
}
export function createNhatKy() {
  return ipcRenderer.invoke('createNhatKy')
}
export function getSettings() {
  return ipcRenderer.invoke('getSettings')
}
export function setSettings(values) {
  return ipcRenderer.invoke('setSettings', values)
}

export function getNhatky(id) {
  if (!id) return [];
  return ipcRenderer.invoke('getNhatky', id)
}