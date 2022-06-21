import { any } from "prop-types";
import React, { useState, useEffect } from "react";
import { PageHeader, Row, Col } from "antd";
// import moment from 'moment';
import ChiTiet from "../components/chitiet";
import Phieu from "./Phieu";
import NhatKy from "../components/nhatKy";
import { getNhatky } from "../utils/db";
import moment from "moment";
const defData = {
  sophieu: "",
  tenkhach: "",
  dienthoai: "",
  monhang: "",
  loaivang: "18K",
  tongtrongluong: "0",
  trongluonghot: "",
  trongluongthuc: "",
  tiencam: "",
  ngayCamChuoc: [null, null],
  ngaychuoc: "",
  ngaycam: "",
  laisuat: 0,
  gia18K: 0,
  gia24K: 0,
  gia9999: 0,
  gianhap: 0,
};

const defNhatKy: any[] = [];

// interface NhatKy { id: number; phieu: any; hoatdong: string; noidung: any; thoigian: any; }

function QuetPhieu() {
  // const [form] = Form.useForm();
  const [formData, setFormData] = useState(defData);
  const [nhatky, setNhatky] = useState(defNhatKy);
  useEffect(() => {
    return () => {};
  }, []);
  // const onFormValuesChange = (values) => {
  //   console.log(values);
  // }
  const onRefresh = async (e: any) => {
    setFormData(e);
    console.log(e);
    const _nhatky: any[] = await getNhatky(e.id);
    const cam = {
      id: 1,
      phieu: e.id,
      hoatdong: "Cầm",
      noidung: `Tiền cầm: ${e.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      thoigian: e.ngaycam,
    };
    if (e.ngaycam)
      setNhatky([
        ...[cam],
        ..._nhatky.map((n: any) => {
          return {
            ...n,
            thoigian: moment(n.thoigian),
            noidung: `${n.noidung}`.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          };
        }),
      ]);
    if (e.ngaychuoc) {
      const chuoc = {
        id: 2,
        phieu: e.id,
        hoatdong: "Chuộc",
        noidung: `Tiền chuộc: ${e.tienchuoc}`.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          "."
        ),
        thoigian: e.ngaychuoc,
      };
      setNhatky([
        ...[cam],
        ..._nhatky.map((n: any) => {
          return {
            ...n,
            thoigian: moment(n.thoigian),
            noidung: `${n.noidung}`.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          };
        }),
        ...[chuoc],
      ]);
    }
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="Quét phiếu cầm"
        subTitle=""
        // extra={}
      />
      <Row>
        <Col className="chitiet-container">
          <ChiTiet
            data={formData}
            close={() => {}}
            quetphieu={true}
            onSearched={onRefresh}
          />
        </Col>
        <Col className="phieu-container" style={{ paddingLeft: 16 }}>
          <Phieu formData={formData} hideCuong={true} />
        </Col>
        <Col className="timeline-container" style={{ paddingLeft: 16 }}>
          <div>
            <NhatKy data={nhatky} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
QuetPhieu.popsType = any;
export default QuetPhieu;
