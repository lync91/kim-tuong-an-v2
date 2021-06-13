import { Moment } from 'moment';

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
  ngaytinhlai: Moment;
  laisuat: number;
  gia18K: number;
  gia23K: number;
  gia9999: number;
  giatinh: number,
  gianhap: number,
  giatoida: number,
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
  ngayCamChuoc: number[],
  ngaychuoc: string;
  ngaycam: string;
  ngaytinhlai: number;
  laisuat: number;
  gia18K: number;
  gia23K: number;
  gia9999: number;
  giatinh: number,
  gianhap: number,
  giatoida: number
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
  ngayCamChuoc: Moment[] | number[];
  ngaychuoc: Moment | string;
  ngaycam: Moment | string;
  ngaytinhlai: Moment | number;
  laisuat: number;
  gia18K: number;
  gia23K: number;
  gia9999: number;
  giatinh: number;
  gianhap: number;
  giatoida: number;
  constructor (data: camdoTypes | camdoDataTypes) {
    this.id = data.id ? data.id : undefined
    this.sophieu = data.sophieu
    this.tenkhach = data.tenkhach
    this.dienthoai = data.dienthoai
    this.monhang = data.monhang
    this.loaivang = data.loaivang
    this.tongtrongluong = data.tongtrongluong
    this.trongluonghot = data.trongluonghot
    this.trongluongthuc = data.trongluongthuc
    this.tiencam = data.tiencam
    this.ngayCamChuoc = data.ngayCamChuoc
    this.ngaychuoc = data.ngaychuoc
    this.ngaycam = data.ngaycam
    this.ngaytinhlai = data.ngaytinhlai
    this.laisuat = data.laisuat
    this.gia18K = data.gia18K
    this.gia23K = data.gia23K
    this.gia9999 = data.gia9999
    this.giatinh = data.giatinh
    this.gianhap = data.gianhap
    this.giatoida = data.giatoida
  }
  forData () {}
}