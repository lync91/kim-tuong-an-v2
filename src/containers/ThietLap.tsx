import React, { useEffect } from "react";
import { PageHeader, Form, Row, Col, Input, message, Tabs } from "antd";
import Button from "antd-button-color";
import { resetData } from "../utils/init";
import {
  createNhatKy,
  createSettings,
  getSettings,
  setSettings,
} from "../utils/db";
import { Barem, Chung, LoaiTaiSan } from "../components/ThietLap";

const { TabPane } = Tabs;

function ThietLap() {
  useEffect(() => {
    return () => {};
  }, []);

  // const onSaveClick = () => {
  //   const values = form.getFieldsValue();
  //   setSettings(values).then((res) => console.log(res));
  //   message.success("Cập nhật cài đặt thành công");
  // };

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Cài đặt chưng" key="1">
          <Chung />
        </TabPane>
        <TabPane tab="Loại tài sản" key="2">
          <LoaiTaiSan />
        </TabPane>
        <TabPane tab="Barem rút tiền" key="3">
          <Barem />
        </TabPane>
      </Tabs>
    </>
  );
}
export default ThietLap;
