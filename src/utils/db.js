import { ipcRenderer } from 'electron';
import moment from 'moment';
import { round } from 'mathjs';

export function getLastId(fn) {
  // knex('camdo').max({ a: 'id' })
  //   .then(res => {
  //     const id = res[0].a;
  //     fn(id);
  //   });
}
export function insertCamdo(data, fn) {
  // db.test(res => console.log(res))
  // data.ngaycam = data.ngayCamChuoc[0].format('x');
  // data.ngayhethan = data.ngayCamChuoc[1].format('x');
  // data.ngaytinhlai = data.ngayCamChuoc[0].format('x');
  // delete data.size;
  // delete data.ngayChuocCam;
  // delete data.gia18K;
  // delete data.gia23K;
  // delete data.gia9999;
  // delete data.giatoida;
  // delete data.ngayCamChuoc;
  // data.tongtrongluong = Number(data.tongtrongluong);
  // knex('camdo').insert(data)
  //   .then(res => fn(res));
}
export function updateCamDo(data) {
  return ipcRenderer.invoke('updateCamdo', data);
}
export function giahanCamDo(id, tienlai, songay, fn) {
  let data = {
    id: id,
    ngaytinhlai: moment().format('x'),
    ngayhethan: moment().add(songay, 'days').format('x'),
    tienlai: tienlai
  };
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
export function camThemTien(id, tienlai, tiencam) {
  let data = {
    id: id,
    tienlai: tienlai,
    tiencam: tiencam,
    ngaytinhlai: moment().format('x')
  };
  return ipcRenderer.invoke('camThemTien', data);
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
export function getSettings() {
  // const a = new Promise((res, rej) => {
  //   knex('settings')
  //     .where('id', 1)
  //     .then(r => res(r[0]))
  //     .catch(e => rej(e))
  // });
  // return a;
}
export function setSettings(values) {
  const a = new Promise((res, rej) => {
    // knex('settings')
    //   .where('id', 1)
    //   .update(values)
    //   .then(r => res(r))
    //   .catch(e => rej(e));
  })
  return a;
}
