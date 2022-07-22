import React, { useEffect } from "react";
import { PageHeader, Form, Row, Col, Input, message } from "antd";
import Button from "antd-button-color";
import { resetData } from "../../utils/init";
import {
  createNhatKy,
  createSettings,
  getSettings,
  setSettings,
} from "../../utils/db";

import { ipcRenderer } from "electron";

export function Chung() {
  const [form] = Form.useForm();
  useEffect(() => {
    getSettings().then((res: any) => {
      form.setFieldsValue(res);
    });
    const res: any = {};
    form.setFieldsValue(res);
    return () => {};
  }, []);
  const onClickresetData = () => {
    // dropCamDo(() => createCamDo());
    // createCamDo()
    resetData();
  };
  const onSaveClick = () => {
    const values = form.getFieldsValue();
    setSettings(values).then((res) => console.log(res));
    message.success("Cập nhật cài đặt thành công");
  };
  const onClickcreateSettings = () => {
    // console.log('OK');
    createSettings();
  };
  return (
    <>
      <Row>
        <Col span={4}></Col>
        <Col span={18}>
          <Form
            form={form}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 6,
            }}
          >
            <Form.Item label="Lãi dưới 10 ngày" name="lai10">
              <Input></Input>
            </Form.Item>
            <Form.Item label="Lãi từ 10 - 20 ngày" name="lai20">
              <Input></Input>
            </Form.Item>
            <Form.Item label="Lãi trên 30 ngày" name="lai30">
              <Input></Input>
            </Form.Item>
            <Form.Item label="Tiền lãi tối thiểu" name="tienToiThieu">
              <Input></Input>
            </Form.Item>
            <Form.Item hidden label="" name="resetData">
              <Button onClick={onClickresetData}>Xóa dữ liệu</Button>
            </Form.Item>
            <Form.Item label="Khác" name="createCamdo">
              <Button onClick={() => ipcRenderer.invoke('createCamdo')}>
                Tạo lại dữ liệu cầm đồ
              </Button>
            </Form.Item>
            <Form.Item label=" " name="createCamdo">
              <Button onClick={onClickcreateSettings}>
                Tạo lại dữ liệu thiết lập
              </Button>
            </Form.Item>
            <Form.Item label=" " name="createThietLap">
              <Button onClick={() => createNhatKy()}>
                Tạo lại dữ liệu nhật ký
              </Button>
            </Form.Item>
            <Form.Item label=" " name="createThietLap">
              <Button onClick={() => ipcRenderer.invoke("addColDo")}>
                Bổ sung cột dơ
              </Button>
            </Form.Item>
            <Form.Item label=" " name="createDotu">
              <Button onClick={() => ipcRenderer.invoke("createDotu")}>
                Tạo bảng đồ tủ
              </Button>
            </Form.Item>
            <Form.Item label=" " name="createDotu">
              <Button onClick={() => ipcRenderer.invoke("createLoaiTaiSan")}>
                Tạo bảng loại tài sản
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={4}></Col>
      </Row>
    </>
  );
}