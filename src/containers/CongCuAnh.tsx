import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

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
import { ipcRenderer } from "electron";
import Sketch from 'react-p5';

const { TabPane } = Tabs;

function CongCuAnh() {
  const { iswindow }: any = useParams();
  const [selected, setSelected] = useState(0)
  const [list, setList] = useState([])
  const [form] = Form.useForm();

  const getData = async () => {
    const data = await ipcRenderer.invoke('getBotData');
    setList(data);
  }

  useEffect(() => {
    getData();
  }, []);

  const setup = (p5: any, parentRef: any) => {
		p5.createCanvas(200, 200).parent(parentRef);
	};

	const draw = (p5: any) => {
		p5.background(0);
	};

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Công cụ ảnh" key="1">
          <div className="img-list">
            {list.map((e, i) => {
              const {photo_link} = e
              return (<img
                className={`img-item ${selected === i ? "selected" : ""}`}
                src={photo_link}
                alt="thumb"
                onClick={() => setSelected(i)}
              />)
            })}
          </div>
          <div>
          <Sketch setup={setup} draw={draw} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
export default CongCuAnh;
