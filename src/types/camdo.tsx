import { number, round } from 'mathjs';
import moment, { Moment } from 'moment';
import { getSettings } from '../utils/db';

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

  constructor(data: camdoTypes) {
    this.id = data.id ? data.id : undefined
    this.sophieu = data.sophieu
    this.tenkhach = data.tenkhach
    this.dienthoai = data.dienthoai
    this.monhang = data.monhang
    this.loaivang = data.loaivang
    this.tongtrongluong = data.tongtrongluong
    this.trongluonghot = data.trongluonghot
    this.trongluongthuc = round(data.trongluongthuc, 3)
    this.tiencam = data.tiencam
    this.ngayCamChuoc = data.ngayCamChuoc ? data.ngayCamChuoc : [moment(data.ngaycam), moment(data.ngayhethan)]
    this.ngaychuoc = data.ngaychuoc ? moment(data.ngaychuoc) : ''
    this.ngaycam = data.ngaycam ? moment(data.ngaycam) : '';
    this.ngaytinhlai = data.ngaytinhlai ? moment(data.ngaytinhlai) : '';
    this.laisuat = 3;
    this.gianhap = 0;
    this.giatoida = 0;
    this.songay = data.ngaytinhlai ? round((Number(moment().format('X')) - Number(moment(data.ngaytinhlai).format('X'))) / (60 * 60 * 24) + 1) : 0;
    this.tienlaidukien = data.tiencam ? round((data.tiencam * (3 * this.songay / 30)) / 100) : 0;
    this.tudo = data.tudo;
    this.tienchuocdukien = this.tiencam + this.tienlaidukien;
    this.tienlai = data.tienlai;
    this.tienchuoc = data.tienchuoc;
    this.ngayhethan = data.ngayhethan ? moment(data.ngayhethan) : '';
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
    this.sophieu = data.sophieu
    this.tenkhach = data.tenkhach
    this.dienthoai = data.dienthoai
    this.monhang = data.monhang
    this.loaivang = data.loaivang
    this.tongtrongluong = data.tongtrongluong
    this.trongluonghot = data.trongluonghot
    this.trongluongthuc = round(data.trongluongthuc, 3)
    this.tiencam = data.tiencam
    this.ngayCamChuoc = data.ngayCamChuoc ? data.ngayCamChuoc : [moment(data.ngaycam), moment(data.ngayhethan)]
    this.ngaychuoc = data.ngaychuoc ? moment(data.ngaychuoc) : ''
    this.ngaycam = data.ngaycam ? moment(data.ngaycam) : '';
    this.ngaytinhlai = data.ngaytinhlai ? moment(data.ngaytinhlai) : '';
    this.laisuat = 3;
    this.gianhap = 0;
    this.giatoida = 0;
    this.songay = data.ngaytinhlai ? round((Number(moment().format('X')) - Number(moment(data.ngaytinhlai).format('X'))) / (60 * 60 * 24) + 1) : 0;
    this.tienlaidukien = data.tiencam ? round((data.tiencam * (3 * this.songay / 30)) / 100) : 0;
    this.tudo = data.tudo;
    this.tienchuocdukien = this.tiencam + this.tienlaidukien;
    this.tienlai = data.tienlai;
    this.tienchuoc = data.tienchuoc;
    this.ngayhethan = data.ngayhethan ? moment(data.ngayhethan) : '';
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
  calc() {
    this.trongluongthuc = round(this.tongtrongluong - this.trongluonghot, 3);
    this.giatoida = round(this.trongluongthuc * this.giatinh);
    return this;
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