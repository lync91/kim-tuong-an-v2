import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Modal, message, Tag, notification, InputNumber } from 'antd';
import Button from 'antd-button-color';
import moment from 'moment';
import { round, evaluate } from 'mathjs';
import { SmileOutlined, CloseCircleOutlined, CheckCircleOutlined, SaveOutlined, PrinterOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { updateCamDo, huyPhieuCam, timPhieubyID, giahanCamDo, chuocDo, camThemTien } from '../utils/db';
import { printPreview } from '../utils/print';
import { camdoDataTypes, camdoTypes, Camdo } from '../types/camdo';
import ModalCamThem from './modalCamThem';
import BarCodeEvent from './barCodeEvent'

const { RangePicker } = DatePicker;

const { Search } = Input;
const dateFormat1 = 'DD/MM/YYYY';

export interface propsType {
  data: any,
  close: any,
  quetphieu: boolean,
  onSearched: any
}

function ChiTiet(props: propsType) {
  const { data, close, quetphieu, onSearched } = props;
  const [form] = Form.useForm();
  const [modalChuoc, setModalChuoc] = useState(false)
  const [modalHuy, setModalHuy] = useState(false)
  const [modalGiaHan, setModalGiaHan] = useState(false)
  const [ngayGiaHan, setNgayGiaHan] = useState(30)
  const [trangthai, setTrangthai] = useState({
    text: 'Chưa quét',
    color: ''
  })
  const [dataLaiSuat, setDataLaiSuat] = useState({ lai10: 3, lai20: 3, lai30: 3 });
  const [modalCamThem, setModalCamThem] = useState(false);
  const inputRef = React.useRef(null);
  const calc = () => {
    const values = form.getFieldsValue();
    const trongluongthuc = round(values.tongtrongluong - values.trongluonghot, 3);
    form.setFieldsValue({ trongluongthuc: trongluongthuc });
  };
  useEffect(() => {
    console.log(data);
    form.setFieldsValue(new Camdo(data));
    return () => {

    };
  }, [data]);
  const _onValuesChange = (value: string, vs: any) => {
    calc();
  };
  const onGiaUpdate = (data: any) => {
    calc();
  };
  const _selectGia = (e: any) => {
    switch (e) {
      default:
      case '18K':
        onGiaUpdate({ gianhap: form.getFieldValue('gia18K') });
        return;
      case '24K':
        onGiaUpdate({ gianhap: form.getFieldValue('gia24K') });
        return;
      case '9999':
        onGiaUpdate({ gianhap: form.getFieldValue('gia9999') });
    }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const save = () => {
    const values = form.getFieldsValue();
    console.log('values', new Camdo(values).toData());
    // data.dachuoc <= 0 ? delete values.tienchuoc : '';
    updateCamDo(new Camdo(values).toData()).then((res: any) => {
      close(true);
    });
    close(true);
  }
  const chuoc = () => {
    calc();
    setModalChuoc(true);
  };
  const giahan = () => {
    calc();
    setModalGiaHan(true);
  };
  const camthem = () => {
    calc();
    setModalCamThem(true);
  };

  const camthemSubmit = (e: string) => {
    const data = form.getFieldsValue();
    camThemTien(data.id, round(data.tienlai + data.tienlaidukien), data.tiencam + e)
    .then((res: any) => {
      timPhieubyID(data.id).then((res: any) => {
        const data = new Camdo(res)
        onSearched(data);
        setTrangthai(data.trangthai);
        setModalCamThem(false)
      });
    })

  }

  const huyphieu = () => {
    setModalHuy(true);
  }

  const handleOk = () => {
    const values = form.getFieldsValue();
    const tienchuoc = form.getFieldValue('tienchuocdukien');
    const tienlai = form.getFieldValue('tienlai');
    const tienlaidukien = form.getFieldValue('tienlaidukien');
    const ngaychuoc = values.ngaychuoc ? values.ngaychuoc.format('x') : moment().format('x');
    console.log('ngaychuoc', ngaychuoc);
    chuocDo(data.id, tienlaidukien + tienlai, tienchuoc, ngaychuoc).then((res: any) => {
      timPhieubyID(data.id).then((res: any) => {
        const data = new Camdo(res)
        onSearched(data);
        setTrangthai(data.trangthai)
      });
      setModalChuoc(false)
    });
  };

  const handleCancel = () => {
    setModalChuoc(false);
  };
  const giaHanCancel = () => {
    setModalGiaHan(false);
    // setInputXacNhan('');
  };
  const giaHanOK = () => {
    const data = form.getFieldsValue();
    const laihientai = data.tienlai | 0;
    const laidukien = form.getFieldValue('tienlaidukien');
    const { ngaytinhlai } = form.getFieldsValue();
    giahanCamDo(data.id, laihientai + laidukien, ngaytinhlai, ngayGiaHan).then(() => {
      timPhieubyID(data.id).then((res: any) => {
        const data = new Camdo(res)
        onSearched(data);
        setTrangthai(data.trangthai)
      })
    })
    setModalGiaHan(false);
    // setInputXacNhan('');
  };
  const handleOkHuy = () => {
    huyPhieuCam(data.id, () => {
      setModalHuy(false);
    });
    message.success('Hủy phiếu cầm đồ thành công')
    close(true);
  };

  const handleCancelHuy = () => {
    setModalHuy(false);
  };
  const labelRender = (c: any) => {
    let text = '';
    let color = ''
    // var start = moment(c.ngaycam).format('X');
    var end = Number(moment(c.ngayhethan).format('X'));
    var now = Number(moment().format('X'));
    const han = (end - now) / (60 * 60 * 24);
    if (han > 0) {
      text = 'Còn hạn';
      color = '#87d068'
    }
    if (han <= 0) {
      text = 'Quá hạn';
      color = '#f50'
    }
    if (c.ngaychuoc > 0) {
      text = 'Đã chuộc';
      color = '#108ee9'
    }
    if (c.dahuy > 0) {
      text = 'Đã hủy';
      color = '#f50'
    }
  }
  const onSearch = (e: string) => {
    if (e === "") return;
    const id = Number(e);
    timPhieubyID(id).then((res: any) => {
      if (!res) {
        notification.open({
          message: 'Không tìm thấy phiếu trong cơ sở dữ liệu',
          description:
            'Hãy cẩn trọng kiểm tra một lần nữa',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        return;
      }
      else {
        const data = new Camdo(res)
        onSearched(data);
        setTrangthai(data.trangthai)
      }
    });
  }
  const print = () => {
    timPhieubyID(form.getFieldValue('id')).then((res: any) => {
      printPreview(new Camdo(res), false)
    })
  }
  const handleScan = (data: any) => {
    console.log(data);
    form.setFieldsValue({ sophieu: data });
    onSearch(data);
  }
  const handleError = (err: any) => {
    console.error(err)
  }
  const camthemNumpad = (e: any) => {
    console.log(e);
    form.setFieldsValue({ tiencamthem: e })
  }
  return (
    <div>
      <BarCodeEvent
        handleError={handleError}
        handleScan={handleScan}
      />
      <Modal title="Xác nhận chuộc đồ"
        visible={modalChuoc}
        onOk={handleOk}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={handleCancel}
      >
        <p>Số ngày cầm: <b>{form.getFieldValue('songay')}</b></p>
        <p>lãi suất: <b>{form.getFieldValue('laisuat')}%</b></p>
        <p>Tiền cầm: <b>{`${form.getFieldValue('tiencam')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền lãi: <b>{`${form.getFieldValue('tienlaidukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuocdukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
      </Modal>
      <Modal title="Gia hạn phiếu chuộc"
        visible={modalGiaHan}
        onOk={giaHanOK}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={giaHanCancel}
      >
        <p>Số ngày cầm: <b>{form.getFieldValue('songay')}</b></p>
        <p>lãi suất: <b>{form.getFieldValue('laisuat')}%</b></p>
        <p>Tiền cầm: <b>{`${form.getFieldValue('tiencam')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        <p>Tiền lãi: <b>{`${form.getFieldValue('tienlaidukien')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
        {/* <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuoc')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p> */}
        Số ngày gia hạn: <b></b><InputNumber defaultValue={30} onChange={((e: number) => setNgayGiaHan(e))} />
      </Modal>
        <ModalCamThem
          visible={modalCamThem}
          onSubmit={camthemSubmit}
          onCancel={(e: any) => setModalCamThem(false)}
          songay={form.getFieldValue('songay')}
          laisuat={form.getFieldValue('laisuat')}
          tiencam={form.getFieldValue('tiencam')}
          tienlaidukien={form.getFieldValue('tienlaidukien')}
          onChange={(e: string) => form.setFieldsValue({tiencamthem: e})}
          change={moment().format('x')} />
      <Modal
        title="Xác nhận hủy phiếu"
        visible={modalHuy}
        onOk={handleOkHuy}
        okText="Xác nhận"
        onCancel={handleCancelHuy}
        cancelText="Hủy"
      >
        <p>{`Phiếu cầm này sẽ chuyển sang trạng thái đã hủy`}</p>
      </Modal>
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
        className="form-chi-tiet"
      >
        <Form.Item label="Mã số phiếu" name="sophieu" >
          {/* <Input disabled={!quetphieu} /> */}
          <Search
            placeholder="Nhập mã số phiếu"
            allowClear
            size="large"
            onSearch={onSearch}
            disabled={!quetphieu}
          />
        </Form.Item>
        <Form.Item label="Tình trạng" >
          <Tag color={trangthai.color} >{trangthai.text}</Tag>
        </Form.Item>
        <Form.Item label="Id" name="id" >
          <Input disabled />
        </Form.Item>
        <Form.Item label="Tên khách hàng" name="tenkhach" >
          <Input ref={inputRef} disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Điện thoại" name="dienthoai" >
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Món hàng" name="monhang">
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Loại vàng" name="loaivang" >
          <Select disabled onChange={_selectGia}>
            <Select.Option value="18K" >18K</Select.Option>
            <Select.Option value="24K" >24K</Select.Option>
            <Select.Option value="9999" >9999</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Trọng lượng" >
          <Form.Item name="tongtrongluong"
            rules={
              [{ required: true }]}
            style={
              { display: 'inline-block', width: 'calc(32% - 4px)' }}
          >
            <Input placeholder="Tổng" disabled={quetphieu} />
          </Form.Item>
          <Form.Item name="trongluonghot"
            rules={
              [{ required: true }]}
            style={
              { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 4px' }}
          >
            <Input placeholder="Hột" disabled={quetphieu} />
          </Form.Item>
          <Form.Item name="trongluongthuc"
            rules={
              [{ required: true }]}
            style={
              { display: 'inline-block', width: 'calc(32% - 4px)', margin: '0 0px' }}
          >
            <Input placeholder="Thực" disabled />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Tủ đồ" name="tudo">
          <Input />
        </Form.Item>
        <Form.Item hidden label="Giá nhập" name="gianhap" >
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Tiền cầm" name="tiencam">
          <InputNumber
            style={{ width: 200 }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            disabled />
        </Form.Item>
        <Form.Item label="Ngày cầm - chuộc" name="ngayCamChuoc" >
          <RangePicker
            format={dateFormat1}
            disabled={quetphieu}
          />
        </Form.Item>
        <Form.Item label="Ngày tính lãi" name="ngaytinhlai">
          <DatePicker format={dateFormat1} disabled={data.dachuoc ? true : false} />
        </Form.Item>
        <Form.Item hidden name="gia18K">
          <Input />
        </Form.Item>
        <Form.Item hidden name="gia24K">
          <Input />
        </Form.Item>
        <Form.Item hidden name="gia9999">
          <Input />
        </Form.Item>
        <Form.Item label="Số ngày" name="songay">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Lãi suất" name="laisuat">
          <Input />
        </Form.Item>
        <Form.Item label="Tiền lãi dự kiến" name="tienlaidukien">
          <InputNumber
            style={{ width: 200 }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            disabled />
        </Form.Item>
        <Form.Item label="Tiền lãi" name="tienlai">
          <InputNumber
            style={{ width: 200 }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            disabled />
        </Form.Item>
        <Form.Item label="Tiền chuộc" name="tienchuoc">
          <InputNumber
            style={{ width: 200 }}
            // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            // parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            disabled={quetphieu} />
        </Form.Item>
        <Form.Item hidden label="Tiền chuộc dự kiến" name="tienchuocdukien">
          <Input disabled={quetphieu} />
        </Form.Item>
        <Form.Item label="Ngày chuộc" name="ngaychuoc">
          <DatePicker format={'DD/MM/YYYY HH:mm'} disabled={data.dachuoc ? true : false} />
        </Form.Item>
        <Form.Item className="chitiet-btn" label="" {...tailLayout} >
          <Button type="danger" disabled={data.dachuoc ? true : false} hidden={quetphieu} onClick={huyphieu} ><CloseCircleOutlined /> Hủy phiếu </Button>
          <Button type="info" disabled={data.dachuoc ? true : false} onClick={chuoc} ><CheckCircleOutlined /> Chuộc </Button>
          <Button type="success" hidden={quetphieu} disabled={data.dachuoc ? true : false} onClick={save}><SaveOutlined /> Lưu </Button>
          <Button type="warning" hidden={!quetphieu} disabled={data.dachuoc ? true : false} onClick={giahan}><PlusCircleOutlined /> Đóng lãi </Button>
          <Button type="info" disabled={data.dachuoc ? true : false} onClick={camthem}><PlusCircleOutlined /> Cầm thêm </Button>
          <Button disabled={data.dachuoc ? true : false} onClick={print}><PrinterOutlined /> In phiếu </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default ChiTiet;
