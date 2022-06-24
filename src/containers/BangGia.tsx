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

const { TabPane } = Tabs;

const { Search } = Input;

const settings: any = {
  610: 2500,
  980: 4200,
  999: 4500,
};

export default function BangGia() {
  const [form] = Form.useForm();
  const inputRef = React.useRef(null);
  const [settingData, setSettingData] = useState(settings);
  const [visible, setVisible] = useState(false);
  useEffect(() => {}, []);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const onGiaUpdate = (data: any) => {
    setSettings(data).then((e) => {
      message.success("Lưu giá vàng thành công");
      setVisible(false);
      getSettings().then(async (res) => {
        setSettingData(res);
      });
    });
  };
  const print = () => {
    printPreview(form.getFieldsValue(), false);
  };

  const onSearch = (value: string) => console.log(value);
  return (
    <>
      <PageHeader
        className="site-page-header"
        extra={[
          <Tag key="4" className="tag-gia" color="volcano" onClick={showDrawer}>
            Vàng 610:{" "}
            <b>
              {`${settingData["610"]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </b>
          </Tag>,
          <Tag key="5" className="tag-gia" color="orange" onClick={showDrawer}>
            Vàng 980:{" "}
            <b>
              {`${settingData["980"]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </b>
          </Tag>,
          <Tag key="6" className="tag-gia" color="gold" onClick={showDrawer}>
            Vàng 9999:{" "}
            <b>
              {`${settingData["999"]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
          <GiaVang data={settingData} onUpdate={onGiaUpdate} />
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
                  <th>Loại vàng</th>
                  <th>Trọng lượng</th>
                  <th>Giá bán</th>
                  <th>Tiền công</th>
                  <th>Cộng</th>
                </tr>
                <tr>
                  <td>N12346</td>
                  <td>610</td>
                  <td>1c32</td>
                  <td>3520</td>
                  <td>250</td>
                  <td>4200</td>
                </tr>
              </table>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  );
}
