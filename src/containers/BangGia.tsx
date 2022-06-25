import React, {useState, useEffect} from "react";

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
import { ipcRenderer } from "electron";
import { floor, number } from "mathjs";

import { chi } from "../utils/tools";

const { TabPane } = Tabs;

const { Search } = Input;

const settings: any = {
  610: 0,
  980: 0,
  9999: 0,
};

const defBangGia: any = {
  id: 0,
  ngaynhap: 0,
  ma: "-",
  kyhieu: "-",
  ten: "-",
  loaivang: "-",
  ncc: "-",
  dongia: 0,
  trongluong: 0,
  tiencong: 0,
  ngayban: 0,
  thanhtien: 0
}

export default function BangGia() {
  const [form] = Form.useForm();
  const inputRef = React.useRef(null);
  const [settingData, setSettingData] = useState(settings);
  const [visible, setVisible] = useState(false);
  const [bangGia, setBangGia] = useState(defBangGia);
  const [gia, setGia] = useState(settings);
  useEffect(() => {
    ipcRenderer.on('codeScanned', (event, data) => {
      console.log(data);
      
    })
    const getGia = async () => {
      const gia = await ipcRenderer.invoke('getGia');
      console.log(gia);
      setGia(gia);
    }
    getGia();
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onGiaUpdate = async (data: any) => {
    const res = await ipcRenderer.invoke('setGia', data);
    setGia(data);
    setVisible(false);
  };
  const print = () => {
    printPreview(form.getFieldsValue(), false);
  };

  const onSearch = async (value: string) => {
    console.log(value);
    const sp = await ipcRenderer.invoke('spByMa', value);
    if (sp) {
      const { trongluong, tiencong, loaivang } = sp;
      const thanhtien = floor(trongluong/10 * gia[loaivang] /10 + tiencong/1000);
      setBangGia({...sp, ...{thanhtien, dongia: gia[loaivang]}});
    }
  };
  return (
    <>
      <PageHeader
        className="site-page-header"
        extra={[
          <Tag key="4" className="tag-gia" color="volcano" onClick={showDrawer}>
            Vàng 610:{" "}
            <b>
              {`${gia["610"]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </b>
          </Tag>,
          <Tag key="5" className="tag-gia" color="orange" onClick={showDrawer}>
            Vàng 980:{" "}
            <b>
              {`${gia["980"]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </b>
          </Tag>,
          <Tag key="6" className="tag-gia" color="gold" onClick={showDrawer}>
            Vàng 9999:{" "}
            <b>
              {`${gia["9999"]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </b>
          </Tag>,
          <Button key="2" hidden onClick={print}>
            <PrinterTwoTone /> In{" "}
          </Button>,
          <Button
            key="1"
            hidden
            type="primary"
            onKeyPress={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
          >
            <ProjectOutlined />
            Lưu và in
          </Button>,
        ]}
      />
      <Layout>
        <Drawer
          title="Thiết lập giá vàng"
          placement="right"
          width={520}
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <GiaVang data={gia} onUpdate={onGiaUpdate} />
        </Drawer>
        <Row>
          <div className="search-container">
            <Search
              size="large"
              placeholder="Nhập mã sản phẩm"
              onSearch={onSearch}
              style={{ width: 260 }}
            />
          </div>
        </Row>
        <Row>
          <Col span={24}>
            <div className="bang-gia-container">
              <table className="bang-gia">
                <tr>
                  <th>Mã số</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại vàng</th>
                  <th>Trọng lượng</th>
                  <th>Đơn giá</th>
                  <th>Tiền công</th>
                  <th>Thành tiền</th>
                </tr>
                <tr>
                  <td>{bangGia.ma}</td>
                  <td>{bangGia.ten}</td>
                  <td>{bangGia.loaivang}</td>
                  <td>{chi(bangGia.trongluong)}</td>
                  <td>{`${bangGia.dongia}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                  <td>{`${bangGia.tiencong/1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                  <td>{`${bangGia.thanhtien}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                </tr>
              </table>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  );
}
