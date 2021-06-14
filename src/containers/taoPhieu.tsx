import React, { useState, useEffect, useRef } from 'react';
import {
  PageHeader,
  Layout,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag,
  Drawer,
  message,
  InputNumber
} from 'antd';
import Button from 'antd-button-color';
import moment from 'moment';
import { camdoTypes } from '../types/camdo';
import { evaluate, round } from 'mathjs';
import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import Keyboard from 'react-simple-keyboard';

import VietIME from '../utils/vietuni';

import {
  getLastId,
  insertCamdo,
} from '../utils/db';
import { padDigits } from '../utils/tools';
// const { PosPrinter } = remote.require('electron-pos-printer');

import { printPreview } from '../utils/print'
import Phieu from './Phieu';
import GiaVang from '../components/giaVang';
const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';
// const genkey = (key) => {
//     return `${crc16('1999009090909')}${generate(4)}`;
// };

const vietIME = new VietIME();
console.log(vietIME);


const defData : camdoTypes = {
  id: 0,
  sophieu: '0000000000',
  tenkhach: '',
  dienthoai: '',
  monhang: '',
  loaivang: '18K',
  tongtrongluong: 0,
  trongluonghot: 0,
  trongluongthuc: 0,
  tiencam: 0,
  ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)],
  ngaytinhlai: moment(),
  ngaychuoc: moment(),
  ngaycam: moment(),
  ngayhethan: moment(),
  laisuat: 5,
  tudo: '',
  tienlai: 0,
  tienchuoc: 0
};

function TaoPhieu() {
  const [form] = Form.useForm();
  const inputRef = React.useRef(null);
  const [formData, setFormData] = useState(defData);
  const [currentInput, setCurrentInput] = useState('tenkhach');
  const [visible, setVisible] = useState(false);
  const tenKhachRef = useRef();
  const calc = () => {
    console.log(form.getFieldsValue())
    const gianhap = Number(form.getFieldValue(`gia${form.getFieldValue('loaivang')}`));
    form.setFieldsValue({ gianhap: gianhap });
    const tongtrongluong = parseFloat(form.getFieldValue('tongtrongluong'));
    const trongluonghot = parseFloat(form.getFieldValue('trongluonghot'));
    console.log(tongtrongluong);
    console.log(trongluonghot);
    const trongluongthuc = round(evaluate(`${tongtrongluong} - ${trongluonghot}`), 3);
    const giatoida = Math.round(trongluongthuc * gianhap);
    form.setFieldsValue({ trongluongthuc: trongluongthuc, giatoida: giatoida });
    setFormData({ ...formData, ...form.getFieldsValue() });
  };
  const genKey = () => {
    getLastId((res: any) => {
      const key = `${padDigits(res + 1, 9)}`;
      form.setFieldsValue({ ...defData, ...{ sophieu: key } });
    });
  };
  useEffect(() => {
    
    genKey();
    const res = {}
    form.setFieldsValue(res)
    form.setFieldsValue({ ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)] })
    setFormData({ ...formData, ...res, ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)] });
    calc();
    // getSettings()
    //   .then(res => {
    //     form.setFieldsValue(res)
    //     form.setFieldsValue({ ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)] })
    //     setFormData({ ...formData, ...res, ngayCamChuoc: [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)] });
    //     calc();
    //   })
  }, []);
  const tenkhachKey = (e: any) => {
    console.log('test', vietIME.targetOnKeyPress(e));
    
    
    // vietUni.vietTyping(e, vietUni, e.target)
  }
  const _onValuesChange = (value: any, vs: any) => {
    setFormData(vs);
    calc();
  };
  const btnClick = (key: string, addspace: boolean) => {
    const tmp: any = {};
    tmp[currentInput] = `${form.getFieldValue(currentInput)}${key}${addspace ? ' ' : ''}`;
    form.setFieldsValue(tmp);
    setFormData({ ...formData, ...form.getFieldsValue() });
    calc();
  };
  const btnXoaClick = () => {
    const tmp: any = {};
    tmp[currentInput] = ``;
    form.setFieldsValue(tmp);
    setFormData({ ...formData, ...form.getFieldsValue() });
    calc();
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onGiaUpdate = (data: camdoTypes) => {
    form.setFieldsValue(data);
  };
  const _selectGia = (e: string) => {
    switch (e) {
      default:
      case '18K':
        onGiaUpdate({...formData, ...{ gianhap: Number(form.getFieldValue('gia18K')) }});
        return;
      case '23K':
        onGiaUpdate({...formData, ...{ gianhap: Number(form.getFieldValue('gia23K')) }});
        return;
      case '9999':
        onGiaUpdate({...formData, ...{ gianhap: Number(form.getFieldValue('gia9999')) }});
    }
  };
  const save = () => {
    insertCamdo(form.getFieldsValue(), () => {
      message.success('Thêm thành công phiếu cầm đồ')
    });
  };
  const print = () => {
    printPreview(form.getFieldsValue(), false);
  }
  const saveAndPrint = () => {
    insertCamdo(form.getFieldsValue(), async () => {
      message.success('Thêm thành công phiếu cầm đồ');
      printPreview(form.getFieldsValue(), false);
      genKey();
      // const giavang = await settings.get('giavang');
      // console.log(giavang);
      const newNgaycamChuoc = [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)];
      // form.setFieldsValue(giavang);
      form.setFieldsValue({ ngayCamChuoc: newNgaycamChuoc })
      setFormData({ ...formData, ngayCamChuoc: newNgaycamChuoc });
      calc();
      // inputRef.current.focus({
      //   cursor: 'all',
      // });
    });
  }
  // const testdate = (e, v) => {
  //   console.log(e)
  //   console.log(v);
  // }
  const onkeyboardChange = (e: any) => {
    console.log(e);
  }
  const onkeyboardKeyPress = (e: string) => {
    vietIME.targetOnKeyPress({charCode: e.charCodeAt(0)})
    vietIME.m_target.value += e;
  }
  return (
    <div >
      <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Tạo phiếu cầm"
        subTitle=""
        extra={
          [
            <Tag key="7" className="tag-gia" color="volcano" onClick={showDrawer}>Lãi suất: <b>{`${formData.laisuat}%`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="4" className="tag-gia" color="volcano" onClick={showDrawer}>Vàng 18K: <b>{`${'formData.gia18K'}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="5" className="tag-gia" color="orange" onClick={showDrawer}>Vàng 23K: <b>{`${'formData.gia23K'}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="6" className="tag-gia" color="gold" onClick={showDrawer}>Vàng 9999: <b>{`${'formData.gia9999'}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Button key="3" hidden onClick={save} ><SaveTwoTone />Lưu</Button>,
            <Button key="2" hidden onClick={print}><PrinterTwoTone /> In </Button>,
            <Button key="1" type="primary" onClick={saveAndPrint} ><ProjectOutlined />Lưu và in</Button>,
          ]
        }
      />
      <Layout >
        <Drawer
          title="Thiết lập giá vàng"
          placement="right"
          width={520}
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <GiaVang data={formData} onUpdate={onGiaUpdate} />
        </Drawer>
        <Row >
          <Col className="panel1" >
            <Form
              form={form}
              labelCol={
                {
                  span: 8,
                }
              }
              wrapperCol={
                {
                  span: 16,
                }
              }
              layout="horizontal"
              onValuesChange={(v: any, vs: any) => _onValuesChange(v, vs)}
              className="form-tao-phieu"
            >
              <Form.Item label="Mã số phiếu" name="sophieu" >
                <Input disabled />
              </Form.Item>
              <Form.Item label="Tên khách hàng" name="tenkhach" >
                <Input 
                onKeyPress={tenkhachKey}
                className={currentInput === 'tenkhach' ? 'input-focused' : ''} 
                onClick={(e: any) => {
                  setCurrentInput('tenkhach');
                  console.log(e.target);
                  vietIME.setTarget(e.target);
                }} 
                ref={(r: any) => inputRef.current = r} />
              </Form.Item>
              <Form.Item label="Điện thoại" name="dienthoai" >
                <Input className={currentInput === 'dienthoai' ? 'input-focused' : ''} onClick={() => setCurrentInput('dienthoai')}/>
              </Form.Item>
              <Form.Item label="Món hàng" name="monhang">
                <Input className={currentInput === 'monhang' ? 'input-focused' : ''} onClick={() => setCurrentInput('monhang')} />
              </Form.Item>
              <Form.Item label="Loại vàng" name="loaivang" >
                <Select onChange={_selectGia}>
                  <Select.Option value="18K" >18K</Select.Option>
                  <Select.Option value="23K" >23K</Select.Option>
                  <Select.Option value="9999" >9999</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Trọng lượng" >
                <Form.Item name="tongtrongluong"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)' }}
                  className={currentInput === 'tongtrongluong' ? 'input-focused' : ''}
                   >
                  <InputNumber placeholder="Tổng" onClick={() => setCurrentInput('tongtrongluong')} />
                </Form.Item>
                <Form.Item name="trongluonghot"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 4px' }}
                  className={currentInput === 'trongluonghot' ? 'input-focused' : ''}
                   >
                  <InputNumber placeholder="Hột" onClick={() => setCurrentInput('trongluonghot')} />
                </Form.Item>
                <Form.Item name="trongluongthuc"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 0px' }}
                  className={currentInput === 'truongluongthuc' ? 'input-focused' : ''}
                   >
                  <Input placeholder="Thực" disabled onClick={() => setCurrentInput('trongluongthuc')} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Giá nhập" name="gianhap">
                <Input disabled className={currentInput === 'gianhap' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Giá tối đa" name="giatoida">
                <Input disabled onClick={() => setCurrentInput('giatoida')} className={currentInput === 'giatoida' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Tiền cầm" name="tiencam">
                <Input onClick={() => setCurrentInput('tiencam')} className={currentInput === 'tiencam' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Ngày cầm - chuộc" name="ngayCamChuoc" >
                <RangePicker
                  format={dateFormat1}
                // defaultValue={[moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)]}
                />
              </Form.Item>
              <Form.Item hidden name="gia18K">
                <Input />
              </Form.Item>
              <Form.Item hidden name="gia23K">
                <Input />
              </Form.Item>
              <Form.Item hidden name="gia9999">
                <Input />
              </Form.Item>
              <Form.Item hidden name="laisuat">
                <Input />
              </Form.Item>
              <Form.Item hidden label="Button" >
                <Button > Button </Button>
              </Form.Item>
            </Form>
            <Row >
              <Col className="num-pad" >
                <Row >
                  <Button type="success" size="large" onClick={() => btnClick('1', false)} > 1 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('2', false)} > 2 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('3', false)} > 3 </Button>
                  <Button type="default" size="large" onClick={() => btnClick('L', true)} > L </Button>
                  <Button type="default" size="large" onClick={() => btnClick('N', true)} > N </Button>
                </Row>
                <Row >
                  <Button type="success" size="large" onClick={() => btnClick('4', false)} > 4 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('5', false)} > 5 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('6', false)} > 6 </Button>
                  <Button type="default" size="large" onClick={() => btnClick('K', true)} > K </Button>
                  <Button type="default" size="large" onClick={() => btnClick('V', true)} > V </Button>
                </Row>
                <Row >
                  <Button type="success" size="large" onClick={() => btnClick('7', false)} > 7 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('8', false)} > 8 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('9', false)} > 9 </Button>
                  <Button type="default" size="large" onClick={() => btnClick('B', true)} > B </Button>
                  <Button type="default" size="large" onClick={() => btnClick('D', true)} > D </Button>
                </Row>
                <Row >
                  <Button type="danger" size="large" onClick={() => btnXoaClick()} > Xóa </Button>
                  <Button type="success" size="large" onClick={() => btnClick('0', false)} > 0 </Button>
                  <Button type="success" size="large" onClick={() => btnClick('.', false)} > . </Button>
                  <Button type="primary" size="large" onClick={() => btnClick('D', false)} > Enter </Button>
                  <Button type="default" size="large" onClick={() => btnClick('M', true)} > M </Button>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col className="panel2">
            <Phieu formData={formData} hideCuong={false} />
          </Col>
        </Row>
        <Row>
          <Keyboard
            onChange={onkeyboardChange}
            onKeyPress={onkeyboardKeyPress}
            layoutName="default"
          />
        </Row>
      </Layout>
    </div>
  );
}
export default TaoPhieu;
