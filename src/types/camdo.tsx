import { number, round } from 'mathjs';
import moment, { Moment } from 'moment';
import { getSettings, insertCamdo } from '../utils/db';

export interface camdoTypes {
  id: number | undefined;
  sophieu: string;
  tenkhach: string;
  dienthoai: string;
  monhang: string;
  loaivang: string;
  tongtrongluong: number;
  trongluonghot: number;
  trongluongthuc: number;
  tiencam: number;
  ngayCamChuoc: Moment[],
  ngaychuoc: Moment;
  ngaycam: Moment;
  ngayhethan: Moment;
  ngaytinhlai: Moment;
  laisuat: number;
  tudo: string;
  tienlai: number;
  tienchuoc: number;
  // gia18K: number;
  // gia23K: number;
  // gia9999: number;
  // giatinh: number,
  // gianhap: number,
  // giatoida: number,
}
export interface camdoDataTypes {
  id: number | undefined;
  sophieu: string;
  tenkhach: string;
  dienthoai: string;
  monhang: string;
  loaivang: string;
  tongtrongluong: number;
  trongluonghot: number;
  trongluongthuc: number;
  tiencam: number;
  ngaychuoc: string;
  ngaycam: string;
  ngayhethan: string;
  ngaytinhlai: string;
  laisuat: number;
  tudo: string;
  tienlai: number;
  tienchuoc: number;

}

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';

const defData = {
  id: 0,
  sophieu: '0000000000',
  tenkhach: '',
  dienthoai: '',
  monhang: '',
  loaivang: '18K',
  tongtrongluong: "",
  trongluonghot: "",
  trongluongthuc: "",
  tiencam: "",
  ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)],
  ngaytinhlai: moment(),
  ngaychuoc: moment(),
  ngaycam: moment(),
  ngayhethan: moment(),
  laisuat: 5,
  tudo: '',
  tienlai: 0,
  tienchuoc: 0,
  gianhap: 0,
  giatoida: 0
}

export class Camdo {
  id: number | undefined;
  sophieu: string;
  tenkhach: string;
  dienthoai: string;
  monhang: string;
  loaivang: string;
  tongtrongluong: number;
  trongluonghot: number;
  trongluongthuc: number;
  tiencam: number;
  ngayCamChuoc: Moment[] | any[];
  ngaychuoc: Moment | any;
  ngaycam: Moment | any;
  ngaytinhlai: Moment | any;
  laisuat: number;
  gianhap: number;
  giatoida: number;
  songay: number;
  tienlaidukien: number;
  tudo: string;
  tienchuocdukien: number;
  tienlai: number;
  tienchuoc: number;
  ngayhethan: Moment | any;
  trangthai: {
    text: string,
    color: string
  };
  gia18K: number;
  gia23K: number;
  gia9999: number;
  giatinh: number;


  constructor(data: camdoTypes | any = {}) {
    this.id = data.id ? data.id : undefined
    this.sophieu = data.sophieu ? data.sophieu : defData.sophieu
    this.tenkhach = data.tenkhach ? data.tenkhach : defData.tenkhach
    this.dienthoai = data.dienthoai ? data.dienthoai : defData.dienthoai
    this.monhang = data.monhang ? data.monhang : defData.monhang
    this.loaivang = data.loaivang ? data.loaivang : defData.loaivang
    this.tongtrongluong = data.tongtrongluong ? data.tongtrongluong : defData.tongtrongluong
    this.trongluonghot = data.trongluonghot ? data.trongluonghot : defData.trongluonghot
    this.trongluongthuc = data.trongluongthuc ? round(data.trongluongthuc, 3) : defData.trongluongthuc;
    this.tiencam = data.tiencam ? data.tiencam : defData.tiencam
    this.ngayCamChuoc = data.ngayCamChuoc ? data.ngayCamChuoc : defData.ngayCamChuoc
    this.ngaychuoc = data.ngaychuoc ? moment(data.ngaychuoc) : defData.ngaychuoc
    this.ngaycam = data.ngaycam ? moment(data.ngaycam) : defData.ngaycam;
    this.ngaytinhlai = data.ngaytinhlai ? moment(data.ngaytinhlai) : defData.ngaytinhlai;
    this.laisuat = data.laisuat ? data.laisuat : defData.laisuat;
    this.gianhap = data.gianhap ? data.gianhap : defData.gianhap;
    this.giatoida = data.giatoida ? data.giatoida : defData.giatoida;
    this.songay = data.ngaytinhlai ? round((Number(moment().format('X')) - Number(moment(data.ngaytinhlai).format('X'))) / (60 * 60 * 24) + 1) : 0;
    this.tienlaidukien = data.tiencam ? round((data.tiencam * (3 * this.songay / 30)) / 100) : 0;
    this.tudo = data.tudo ? data.tudo : defData.tudo;
    this.tienchuocdukien = this.tiencam + this.tienlaidukien;
    this.tienlai = data.tienlai ? data.tienlai : defData.tienlai;
    this.tienchuoc = data.tienchuoc ? data.tienchuoc : defData.tienchuoc;
    this.ngayhethan = data.ngayhethan ? moment(data.ngayhethan) : defData.ngayhethan;
    this.trangthai = {
      text: 'Chưa quét',
      color: ''
    }
    this.gia18K = 2500000;
    this.gia23K = 4200000;
    this.gia9999 = 4500000;
    this.giatinh = 2500000;
    this.giatoida = 0;
    getSettings().then(res => {
      this.gia18K = res.gia18K;
      this.gia23K = res.gia23K;
      this.gia9999 = res.gia9999
      this.giatinh = res.gia18K
    })
    this.setTrangThai(data)
  }
  update(data: any) {
    this.id = data.id ? data.id : undefined
    this.sophieu = data.sophieu ? data.sophieu : this.sophieu;
    this.tenkhach = data.tenkhach ? data.tenkhach : this.tenkhach;
    this.dienthoai = data.dienthoai ? data.dienthoai : this.dienthoai;
    this.monhang = data.monhang ? data.monhang : this.monhang;
    this.loaivang = data.loaivang ? data.loaivang : this.loaivang;
    this.tongtrongluong = data.tongtrongluong ? data.tongtrongluong : this.tongtrongluong;
    this.trongluonghot = data.trongluonghot ? data.trongluonghot : this.trongluonghot;
    this.trongluongthuc = data.trongluongthuc ? round(data.trongluongthuc, 3) : this.trongluongthuc;
    this.tiencam = data.tiencam ? data.tiencam : this.tiencam;
    this.ngayCamChuoc = data.ngayCamChuoc ? data.ngayCamChuoc : [moment(data.ngaycam), moment(data.ngayhethan)]
    this.ngaychuoc = data.ngaychuoc ? moment(data.ngaychuoc) : this.ngaychuoc
    this.ngaycam = data.ngaycam ? moment(data.ngaycam) : this.ngaycam;
    this.ngaytinhlai = data.ngaytinhlai ? moment(data.ngaytinhlai) : this.ngaytinhlai;
    this.laisuat = data.laisuat ? data.laisuat : this.laisuat;
    this.gianhap = data.gianhap ? data.gianhap : this.gianhap;
    this.giatoida = data.giatoida ? data.giatoida : this.giatoida;
    this.songay = data.ngaytinhlai ? round((Number(moment().format('X')) - Number(moment(data.ngaytinhlai).format('X'))) / (60 * 60 * 24) + 1) : 0;
    this.tienlaidukien = data.tiencam ? round((data.tiencam * (3 * this.songay / 30)) / 100) : 0;
    this.tudo = data.tudo ? data.sophieu : this.sophieu;
    this.tienchuocdukien = this.tiencam + this.tienlaidukien;
    this.tienlai = data.tienlai ? data.sophieu : this.sophieu;
    this.tienchuoc = data.tienchuoc  ? data.sophieu : this.sophieu;
    this.ngayhethan = data.ngayhethan ? moment(data.ngayhethan) : this.ngayhethan;
    this.trangthai = {
      text: 'Chưa quét',
      color: ''
    }
    this.setTrangThai(data);
    return this;
  }
  setGiaTinh(value: number) {
    this.giatinh = value;
    return this;
  }
  setGia(value: any) {
    this.gia18K = value.gia18K;
    this.gia23K = value.gia23K;
    this.gia9999 = value.gia9999;
    return this;
  }
  setSophieu(value: string) {
    this.sophieu = value;
    return this;
  }
  setTrangThai(c: any) {
    var end = Number(moment(c.ngayhethan).format('X'));
    var now = Number(moment().format('X'));
    const han = (end - now) / (60 * 60 * 24);
    if (han > 0) this.trangthai = {
      text: 'Còn hạn',
      color: '#87d068'
    }
    if (han <= 0) this.trangthai = {
      text: 'Quá hạn',
      color: '#f50'
    }
    if (c.ngaychuoc > 0) this.trangthai = {
      text: 'Đã chuộc',
      color: '#108ee9'
    }
    if (c.dahuy > 0) this.trangthai = {
      text: 'Đã hủy',
      color: '#f50'
    }
    return this;
  }
  toData() {
    const data: camdoDataTypes = {
      id: this.id,
      sophieu: this.sophieu,
      tenkhach: this.tenkhach,
      dienthoai: this.dienthoai,
      monhang: this.monhang,
      loaivang: this.loaivang,
      tongtrongluong: this.tongtrongluong,
      trongluonghot: this.trongluonghot,
      trongluongthuc: this.trongluongthuc,
      tiencam: this.tiencam,
      ngaychuoc: this.ngaychuoc ? this.ngaychuoc.format('x') : null,
      ngaycam: this.ngayCamChuoc ? this.ngayCamChuoc[0].format('x') : null,
      ngaytinhlai: this.ngaytinhlai ? this.ngaytinhlai.format('x') : null,
      laisuat: this.laisuat,
      tudo: this.tudo,
      tienlai: this.tienlai,
      tienchuoc: this.tienchuoc,
      ngayhethan: this.ngayCamChuoc ? this.ngayCamChuoc[1].format('x') : null,
    }
    return data;
  }
  save() {
    const data = {
      sophieu: this.sophieu,
      tenkhach: this.tenkhach,
      dienthoai: this.dienthoai,
      monhang: this.monhang,
      loaivang: this.loaivang,
      tongtrongluong: this.tongtrongluong,
      trongluonghot: this.trongluonghot,
      trongluongthuc: this.trongluongthuc,
      tiencam: this.tiencam,
      ngaycam: this.ngayCamChuoc ? this.ngayCamChuoc[0].format('x') : null,
      ngaytinhlai: this.ngaytinhlai ? this.ngaytinhlai.format('x') : null,
      ngayhethan: this.ngayCamChuoc ? this.ngayCamChuoc[1].format('x') : null,
      laisuat: this.laisuat,
    }
    return insertCamdo(data);
  } 
  calc() {
    const trongluongthuc = round(this.tongtrongluong - this.trongluonghot, 3);
    const giatoida = round(this.trongluongthuc * this.giatinh);
    this.trongluongthuc = trongluongthuc;
    this.giatoida = giatoida;
    return this;
  }
  calcObj() {
    return {
      giatoida: this.giatoida,
      trongluongthuc: this.trongluongthuc
    }
  }
}
export interface settingsTypes {
  gia18K: number,
  gia23K: number,
  gia9999: number,
  lai10: number,
  lai20: number,
  lai30: number,
  tienToiThieu: number
}