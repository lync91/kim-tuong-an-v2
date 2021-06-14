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
import Keyboard from 'react-simple-keyboard';
import VietIME from '../utils/vietuni';
import {
  getLastId,
  insertCamdo,
  getSettings,
  setSettings
} from '../utils/db';
import { padDigits } from '../utils/tools';

import { printPreview } from '../utils/print'
import Phieu from './Phieu';
import GiaVang from '../components/giaVang';
import { NamePath } from 'antd/lib/form/interface';
const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY, h:mm:ss A';
const dateFormat1 = 'DD/MM/YYYY';
const vietIME = new VietIME();


const defData: any = new Camdo({
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
});

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
  const [currentInput, setCurrentInput] = useState('tenkhach');
  const [visible, setVisible] = useState(false);
  const keyboard = useRef(null);
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
    const newForm = defData.update(vs).calc()
    form.setFieldsValue(newForm)
    setFormData(newForm);
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
    insertCamdo(defData.forData());
  };
  const print = () => {
    printPreview(form.getFieldsValue(), false);
  }
  const saveAndPrint = () => {
    console.log(defData.toData());
    
    insertCamdo(defData.toData());
    // insertCamdo(form.getFieldsValue(), async () => {
    //   message.success('Thêm thành công phiếu cầm đồ');
    //   printPreview(form.getFieldsValue(), false);
    //   genKey();
    //   // const giavang = await settings.get('giavang');
    //   // console.log(giavang);
    //   const newNgaycamChuoc = [moment(moment().format(dateFormat), dateFormat), moment(moment().add(30, 'days').format(dateFormat), dateFormat)];
    //   // form.setFieldsValue(giavang);
    //   form.setFieldsValue({ ngayCamChuoc: newNgaycamChuoc })
    //   setFormData({ ...formData, ngayCamChuoc: newNgaycamChuoc });
    //   calc();
    // });
  }
  const _setCurrentInput = (e: string) => {
    setCurrentInput(e);
    const val = form.getFieldValue(e);
    const k: any = keyboard.current;
    k.setInput(val)

  }

  const commonKeyboardOptions = {
    onKeyPress: (button: any) => onkeyboardKeyPress(button),
    theme: "simple-keyboard hg-theme-default hg-layout-default",
    physicalKeyboardHighlight: true,
    syncInstanceInputs: true,
    mergeDisplay: true,
    debug: true
  };

  const keyboardOptions = {
    ...commonKeyboardOptions,
    layout: {
      default: [
        "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
        "{tab} Q W E R T Y U I O P { } |",
        '{capslock} A S D F G H J K L : " {enter}',
        "{shiftleft} Z X C V B N M < > ? {shiftright}",
        "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
      ],
      shift: [
        "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
        "{tab} Q W E R T Y U I O P { } |",
        '{capslock} A S D F G H J K L : " {enter}',
        "{shiftleft} Z X C V B N M < > ? {shiftright}",
        "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
      ]
    },
    display: {
      "{escape}": "esc ⎋",
      "{tab}": "tab ⇥",
      "{backspace}": "backspace ⌫",
      "{enter}": "enter ↵",
      "{capslock}": "caps lock ⇪",
      "{shiftleft}": "shift ⇧",
      "{shiftright}": "shift ⇧",
      "{controlleft}": "ctrl ⌃",
      "{controlright}": "ctrl ⌃",
      "{altleft}": "alt ⌥",
      "{altright}": "alt ⌥",
      "{metaleft}": "cmd ⌘",
      "{metaright}": "cmd ⌘"
    }
  };

  const keyboardNumPadOptions = {
    ...commonKeyboardOptions,
    layout: {
      default: [
        "1 2 3 L N",
        "4 5 6 K V",
        "7 8 9 B D",
        "000 0 . M T",
        "{space}"
      ]
    }
  };
  const onkeyboardKeyPress = async (e: string) => {
    const k: any = keyboard.current;
    const val = await vietIME.targetRun(e, k.getInput());
    k.setInput(val ? val : k.getInput());
    // form.setFieldsValue({ tenkhach: k.getInput() })
    const tmp: any = {};
    tmp[currentInput] = k.getInput();
    form.setFieldsValue(tmp);
    setFormData(form.getFieldsValue());
    form.setFieldsValue(defData.update(form.getFieldsValue()).calc())
  }
  const layoutName = "default";
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
                  className={currentInput === '' ? 'input-focused' : ''}
                  onClick={(e: any) => _setCurrentInput('tenkhach')}
                  ref={(r: any) => inputRef.current = r} />
              </Form.Item>
              <Form.Item label="Điện thoại" name="dienthoai" >
                <Input className={currentInput === 'dienthoai' ? 'input-focused' : ''} onClick={() => _setCurrentInput('dienthoai')} />
              </Form.Item>
              <Form.Item label="Món hàng" name="monhang">
                <Input className={currentInput === 'monhang' ? 'input-focused' : ''} onClick={() => _setCurrentInput('monhang')} />
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
                  <Input placeholder="Tổng" onClick={() => _setCurrentInput('tongtrongluong')} />
                </Form.Item>
                <Form.Item name="trongluonghot"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 4px' }}
                  className={currentInput === 'trongluonghot' ? 'input-focused' : ''}
                >
                  <Input placeholder="Hột" onClick={() => _setCurrentInput('trongluonghot')} />
                </Form.Item>
                <Form.Item name="trongluongthuc"
                  rules={
                    [{ required: true }]}
                  style={
                    { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 0px' }}
                  className={currentInput === 'truongluongthuc' ? 'input-focused' : ''}
                >
                  <Input placeholder="Thực" disabled onClick={() => _setCurrentInput('trongluongthuc')} />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Giá nhập" name="gianhap">
                <Input disabled className={currentInput === 'gianhap' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Giá tối đa" name="giatoida">
                <Input disabled onClick={() => _setCurrentInput('giatoida')} className={currentInput === 'giatoida' ? 'input-focused' : ''} />
              </Form.Item>
              <Form.Item label="Tiền cầm" name="tiencam">
                <Input onClick={() => _setCurrentInput('tiencam')} className={currentInput === 'tiencam' ? 'input-focused' : ''} />
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
          <div style={{ paddingLeft: 50 }}>
            <div className={"keyboardContainer"}>
              <div className="numPad">
                <Keyboard
                  baseClass={"simple-keyboard-numpad"}
                  {...keyboardNumPadOptions}
                />
              </div>
              <Keyboard
                baseClass={"simple-keyboard-main"}
                keyboardRef={(r: any) => (keyboard.current = r)}
                layoutName={layoutName}
                {...keyboardOptions}
              />
            </div>
          </div>
        </Row>
      </Layout>
    </div>
  );
}
export default TaoPhieu;
