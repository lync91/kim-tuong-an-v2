import React, { useEffect, useState } from "react";
import ReactDataGrid from "react-data-grid";
import Button from "antd-button-color";
import { ipcRenderer } from "electron";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Select,
  Row,
  Steps,
  Tabs,
  Result,
} from "antd";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
  FileSyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { chi, vnd } from "../utils/tools";

const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

const Vnd = ({ value }: any) => {
  return <>{vnd(value)}</>;
};

const Chi = ({ value }: any) => {
  return <>{chi(value)}</>;
};

const NgaythangFormatter = ({ value }: any) => {
  if (!value) return <></>;
  if (value === "null") return <></>;
  if (/(([0-9]{2}\/){2}[0-9]{4})/g.test(value))
    return <>{moment(value, "DD/MM/YYYY").format("DD/MM/YYYY")}</>;
  return <>{moment(value).format("DD/MM/YYYY")}</>;
};

const columns = [
  { key: "ngaynhap", name: "Ngày nhập", formatter: NgaythangFormatter },
  { key: "ma", name: "Mã" },
  { key: "ten", name: "Tên" },
  { key: "loaivang", name: "Loại vàng" },
  { key: "trongluong", name: "Trọng lượng", formatter: Chi },
  { key: "tiencong", name: "Công", formatter: Vnd },
  { key: "ngayban", name: " Ngày bán", formatter: NgaythangFormatter },
];

const rows = [
  { id: 0, title: "row1", count: 20 },
  { id: 1, title: "row1", count: 40 },
  { id: 2, title: "row1", count: 60 },
];

const defPreviewData: any[] = [];

const defColmap = {
  sheetname: "DO TU",
  ngaynhap: "A",
  ma: "B",
  kyhieu: "C",
  ten: "D",
  loaivang: "E",
  ncc: "F",
  trongluong: "H",
  tiencong: "K",
  ngayban: "L",
  startRow: "2",
};

function lettersToNumber(letters: string) {
  var chrs = " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    mode = chrs.length - 1,
    number = 0;
  for (var p = 0; p < letters.length; p++) {
    number = number * mode + chrs.indexOf(letters[p]);
  }
  return number;
}

export default function DuLieu() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sheetNames, setSheetNames] = useState([]);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState("");
  const [previewData, setPreviewData] = useState(defPreviewData);
  const [colMap, setColMap] = useState(defColmap);
  const [hientai, setHientai] = useState(1);
  const [daco, setDaco] = useState(0);
  const [danhap, setDanhap] = useState(0);
  useEffect(() => {
    form.setFieldsValue(defColmap);
    ipcRenderer.on("importProgress", (event, data) => {
      const { hientai ,status } = data;
      setHientai(hientai);
      if (status === "daco") setDaco((p) => p + 1);
      if (status === "danhap") setDanhap((p) => p + 1);
      // if (hientai === previewData.length) setStep(step + 1);
    });
    ipcRenderer.on("importComplate", (event) => {
      setStep(3);
    });
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setDaco(0);
    setDanhap(0);
    setHientai(1);
    ipcRenderer.send("importData", previewData);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const handleNext = async () => {
    setStep(step + 1);
    if (step === 0) {
      setPreviewData([]);
      const { sheetname } = form.getFieldsValue();
      const data: any[] = await ipcRenderer.invoke(
        "readExcel",
        path,
        sheetname
      );
      console.log(data[1]);

      const _data: any[] = await data
        .splice(Number(defColmap.startRow) - 1, data.length - 1)
        .map((e: any, i: number) => {
          return {
            id: i,
            ngaynhap: `${e[lettersToNumber(defColmap.ngaynhap) - 1]}`,
            ma: e[lettersToNumber(defColmap.ma) - 1],
            kyhieu: e[lettersToNumber(defColmap.kyhieu) - 1],
            ten: e[lettersToNumber(defColmap.ten) - 1],
            loaivang: e[lettersToNumber(defColmap.loaivang) - 1],
            ncc: e[lettersToNumber(defColmap.ncc) - 1],
            trongluong: e[lettersToNumber(defColmap.trongluong) - 1],
            tiencong: e[lettersToNumber(defColmap.tiencong) - 1],
            ngayban: `${e[lettersToNumber(defColmap.ngayban) - 1]}`,
          };
        });
      console.log(_data);
      setPreviewData(_data);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const openExcel = async () => {
    const { sheetNames, filePath } = await ipcRenderer.invoke("openExcel");
    setPath(filePath);
    setSheetNames(sheetNames);
    showModal();
  };

  const onFormChange = (e: any) => {
    console.log(e);

    setColMap({...colMap, ...e});
  };

  return (
    <>
      <div className="toolbar">
        <Button color="primary" onClick={openExcel}>
          Nhập dữ liệu
        </Button>
      </div>
      <Modal
        title="Nhập dữ liệu từ Excel"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Huỷ
          </Button>,
          <Button type="primary" onClick={handleBack} disabled={step <= 0}>
            Quay lại
          </Button>,
          <Button type="primary" onClick={handleNext} disabled={step >= 2}>
            Tiếp
          </Button>,
          <Button type="primary" onClick={handleOk} disabled={step < 2}>
            Bắt đầu
          </Button>,
        ]}
      >
        {/* <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs> */}
        <Form
          hidden={step !== 0}
          name="basic"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={form}
          onValuesChange={onFormChange}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="Tên Sheet" name="sheetname">
                <Select style={{ width: 120 }}>
                  {sheetNames.map((e: string) => (
                    <Option value={e}>{e}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Ngày nhập" name="ngaynhap">
                <Input />
              </Form.Item>
              <Form.Item label="Mã" name="ma">
                <Input />
              </Form.Item>
              <Form.Item label="K.Hiệu" name="kyhieu">
                <Input />
              </Form.Item>
              <Form.Item label="Tên" name="ten">
                <Input />
              </Form.Item>
              <Form.Item label="Dòng bắt đầu" name="startRow">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại vàng" name="loaivang">
                <Input />
              </Form.Item>
              <Form.Item label="Nhà cung cấp" name="ncc">
                <Input />
              </Form.Item>
              <Form.Item label="Trọng lượng" name="kyhieu">
                <Input />
              </Form.Item>
              <Form.Item label="Tiền công" name="tiencong">
                <Input />
              </Form.Item>
              <Form.Item label="Ngày bán" name="ngayban">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div hidden={step !== 1} style={{ marginBottom: 15 }}>
          <ReactDataGrid
            columns={columns}
            rowGetter={(i) => previewData[i]}
            rowsCount={previewData.length}
          />
        </div>
        <div hidden={step !== 2} style={{ marginBottom: 28 }}>
          <Row>
            <Col style={{ width: 220 }}>
              <p>Tổng số sản phẩm:</p>
              <p>Sản phẩm hiện tại:</p>
              <p>Đã cập nhật:</p>
              <p>Đã thêm:</p>
            </Col>
            <Col span={8}>
              <p>{previewData.length}</p>
              <p>{hientai}</p>
              <p>{daco}</p>
              <p>{danhap}</p>
            </Col>
          </Row>
        </div>
        <div hidden={step !== 3} style={{ marginTop: 30, marginBottom: 30 }}>
          <Result status="success" title="Nhập dữ liệu thành công!" />
        </div>
        <Steps size="small" current={step}>
          <Step title="Thiết lập" icon={<UserOutlined />} />
          <Step title="Kiểm tra" icon={<SolutionOutlined />} />
          <Step title="Nhập liệu" icon={<FileSyncOutlined />} />
          <Step title="Hoàn thành" icon={<SmileOutlined />} />
        </Steps>
      </Modal>
      <ReactDataGrid
        columns={columns}
        rowGetter={(i) => rows[i]}
        rowsCount={3}
        minHeight={600}
      />
    </>
  );
}
