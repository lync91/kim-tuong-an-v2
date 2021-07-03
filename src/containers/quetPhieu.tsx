import { any } from 'prop-types'
import React, { useState, useEffect } from 'react'
import { PageHeader, Row, Col } from 'antd';
// import moment from 'moment';
import ChiTiet from '../components/chitiet';
import Phieu from './Phieu';

const defData = {
  sophieu: '',
  tenkhach: '',
  dienthoai: '',
  monhang: '',
  loaivang: '18K',
  tongtrongluong: '0',
  trongluonghot: '',
  trongluongthuc: '',
  tiencam: '',
  ngayCamChuoc: [null, null],
  ngaychuoc: '',
  ngaycam: '',
  laisuat: 0,
  gia18K: 0,
  gia24K: 0,
  gia9999: 0,
  gianhap: 0
};

function QuetPhieu() {
  // const [form] = Form.useForm();
  const [formData, setFormData] = useState(defData);
  useEffect(() => {

    return () => {

    }
  }, [])
  // const onFormValuesChange = (values) => {
  //   console.log(values);
  // }
  const onRefresh = (e: any) => {
    setFormData(e)
  }
  return (
    <div>
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Quét phiếu cầm"
        subTitle=""
        // extra={}
      />
      <Row>
        <Col span={12}>
            <ChiTiet data={formData} close={() => {}} quetphieu={true} onSearched={onRefresh} />
        </Col>
        <Col span={12} style={{paddingLeft: 16}}>
            <Phieu formData={formData} hideCuong={true} />
        </Col>
      </Row>
    </div>
  )
}
QuetPhieu.popsType = any
export default QuetPhieu
