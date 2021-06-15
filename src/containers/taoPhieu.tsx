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
} from 'antd';
import Button from 'antd-button-color';
import moment from 'moment';
import { camdoTypes, settingsTypes, Camdo } from '../types/camdo';
import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import {
  getLastId,
  insertCamdo,
  getSettings,
  setSettings
} from '../utils/db';
import { padDigits } from '../utils/tools';

import { printPreview } from '../utils/print'
import KeyBoard1 from '../components/keyBoard'
import Phieu from './Phieu';
import GiaVang from '../components/giaVang';
const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';
let defData: any = new Camdo();

const settings: settingsTypes = {
  gia18K: 2500000,
  gia23K: 4200000,
  gia9999: 4500000,
  lai10: 5,
  lai20: 4,
  lai30: 3,
  tienToiThieu: 5000
}

function TaoPhieu() {
  const [form] = Form.useForm();
  const inputRef = React.useRef(null);
  const [formData, setFormData] = useState(defData);
  const [settingData, setSettingData] = useState(settings)
  const [visible, setVisible] = useState(false);
  const [inputName, setInputName] = useState("tenkhach");
  const [input, setInput] = useState({tenkhach: ''});
  const calc = () => {
  };
  const genKey = () => {
    getLastId()
      .then(e => {
        const sp = padDigits(e.a + 1, 9)
        form.setFieldsValue(defData.setSophieu(sp));
        setFormData(defData.setSophieu(sp))
      });
  };
  useEffect(() => {
    genKey();
    getSettings()
      .then(res => {
        setSettingData(res)
      });
    calc();
  }, []);
  const _onValuesChange = (value: any, vs: any) => {
    const newForm = defData.update(vs).calc().calcObj();
    setFormData({...vs, ...newForm});
    setInput({...vs, ...newForm});
    form.setFieldsValue(newForm);
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onGiaUpdate = (data: camdoTypes) => {
    setSettings(data)
    .then(e => {
      console.log(e);
      message.success('Lưu giá vàng thành công');
      setVisible(false);
      getSettings()
      .then(res => {
        setSettingData(res);
        _selectGia(form.getFieldValue('loaivang'))
      });
    })
  };
  const _selectGia = (e: string) => {
    switch (e) {
      default:
      case '18K':
        form.setFieldsValue(defData.setGia(settingData).setGiaTinh(settingData.gia18K).calc());
        return;
      case '23K':
        form.setFieldsValue(defData.setGia(settingData).setGiaTinh(settingData.gia23K).calc());
        return;
      case '9999':
        form.setFieldsValue(defData.setGia(settingData).setGiaTinh(settingData.gia9999).calc());
    }
  };
  const save = () => {
    defData.save()
    .then((res: any) => {
      console.log(res);
      
    })
  };
  const print = () => {
    printPreview(form.getFieldsValue(), false);
  }
  const saveAndPrint = () => {
    defData.save()
    .then((res: any) => {
      // console.log(res);
      defData = new Camdo();
      genKey();
      setInput({tenkhach: ''})
    })
  }
  const onChangeAll = (inputObj: any) => {
    setInput(inputObj);
    const calc = defData.update({...form.getFieldsValue(), ...inputObj}).calc();
    const _data = form.getFieldsValue();
    form.setFieldsValue({..._data, ...calc});
    setFormData({..._data, ...calc});
  }
  const onKeyPress = (button: any) => {
    console.log("Button pressed", button);
  };
  const _setinputName = (e: string) => {
    setInputName(e);
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
            <Tag key="4" className="tag-gia" color="volcano" onClick={showDrawer}>Vàng 18K: <b>{`${settingData.gia18K}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="5" className="tag-gia" color="orange" onClick={showDrawer}>Vàng 23K: <b>{`${settingData.gia23K}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
            <Tag key="6" className="tag-gia" color="gold" onClick={showDrawer}>Vàng 9999: <b>{`${settingData.gia9999}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></Tag>,
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
          <GiaVang data={settingData} onUpdate={onGiaUpdate} />
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
                  value={input['tenkhach']}
                  className={inputName === '' ? 'input-focused' : ''}
                  onFocus={(e: any) => _setinputName('tenkhach')}
                  ref={(r: any) => inputRef.current = r} />
              </Form.Item>
              <Form.Item label="Điện thoại" name="dienthoai" >
                <Input className={inputName === 'dienthoai' ? 'input-focused' : ''} onFocus={() => _setinputName('dienthoai')} />
              </Form.Item>
              <Form.Item label="Món hàng" name="monhang">
                <Input className={inputName === 'monhang' ? 'input-focused' : ''} onFocus={() => _setinputName('monhang')} />
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
                  className={inputName === 'tongtrongluong' ? 'input-focused' : ''}
                >
                  <Input placeholder="Tổng" onFocus={() => _setinputName('tongtrongluong')} />
                </Form.Item>
                <Form.Item name="trongluonghot"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 4px' }}
                  className={inputName === 'trongluonghot' ? 'input-focused' : ''}
                >
                  <Input placeholder="Hột" onFocus={() => _setinputName('trongluonghot')} />
                </Form.Item>
                <Form.Item name="trongluongthuc"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 0px' }}
                  className={inputName === 'truongluongthuc' ? 'input-focused' : ''}
                >
                  <Input placeholder="Thực" disabled onFocus={() => _setinputName('trongluongthuc')} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Giá nhập" name="gianhap">
                <Input disabled className={inputName === 'gianhap' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Giá tối đa" name="giatoida">
                <Input disabled onFocus={() => _setinputName('giatoida')} className={inputName === 'giatoida' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Tiền cầm" name="tiencam">
                <Input onFocus={() => _setinputName('tiencam')} className={inputName === 'tiencam' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Ngày cầm - chuộc" name="ngayCamChuoc" >
                <RangePicker
                  format={dateFormat1} />
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
              </Col>
            </Row>
          </Col>
          <Col className="panel2">
            <Phieu formData={formData} hideCuong={false} />
          </Col>
        </Row>
        <Row>
          <KeyBoard1
        inputName={inputName}
        onChangeAll={onChangeAll}
        onKeyPress={onKeyPress}
        input={input}
      />
        </Row>
      </Layout>
    </div>
  );
}
export default TaoPhieu;
