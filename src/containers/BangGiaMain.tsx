import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';

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
  InputNumber,
  Tabs,
} from "antd";
import Button from "antd-button-color";
import moment from "moment";
import {
  SaveTwoTone,
  PrinterTwoTone,
  ProjectOutlined,
} from "@ant-design/icons";
import {
  getLastId,
  insertCamdo,
  getSettings,
  setSettings,
  timPhieubyID,
} from "../utils/db";

import { printPreview } from "../utils/print";
import GiaVang from "../components/giaVang";
import BangGia from "./BangGia";
import DuLieu from "./DuLieu";

const { TabPane } = Tabs;

const { Search } = Input;

const settings: any = {
  610: 2500,
  980: 4200,
  999: 4500,
};

function BangGiaMain({onHideSide}: any) {

  const { iswindow }: any = useParams();

  const [form] = Form.useForm();
  useEffect(() => {
    if (iswindow === 'true') {
      onHideSide(true)
    }
  }, [iswindow]);



  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Tính giá" key="1">
          <BangGia />
        </TabPane>
        <TabPane tab="Dữ liệu" key="2">
          <DuLieu />
        </TabPane>
        <TabPane tab="Bán hàng" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="Kiểm kho" key="4">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
      
    </div>
  );
}
export default BangGiaMain;
