// import PropTypes from 'prop-types';
// const { string, number } = PropTypes
// export const camdoTypes = {
//   data: {
//     sophieu: string,
//     tenkhach: string,
//     dienthoai: string,
//     monhang: string,
//     loaivang: string,
//     tongtrongluong: number,
//     trongluonghot: number,
//     trongluongthuc: number,
//     tiencam: number,
//     // ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)],
//     ngaychuoc: string,
//     ngaycam: string,
//     laisuat: number,
//     gia18K: number,
//     gia24K: number,
//     gia9999: number,
//     giatinh: number
//   }
// }
import { Moment } from 'moment';

export interface camdoTypes {
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
  ngaychuoc: string;
  ngaycam: string;
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
  sophieu: string;
  tenkhach: string;
  dienthoai: string;
  monhang: string;
  loaivang: string;
  tongtrongluong: number;
  trongluonghot: number;
  trongluongthuc: number;
  tiencam: number;
  ngayCamChuoc: number,
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