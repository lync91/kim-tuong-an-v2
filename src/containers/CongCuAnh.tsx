import React, { useState, useEffect, useRef } from "react";
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
import Sketch from "react-p5";
import PhotoCrop from "../components/PhotoCrop";
import { printCmnd } from "../utils/print";

const { TabPane } = Tabs;

function CongCuAnh() {
  const { iswindow }: any = useParams();
  const [selected, setSelected] = useState<{
    index: number;
    url: string | null;
  }>({ index: -1, url: null });
  const [list, setList] = useState([]);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  // function _loadImage(file: any) {
  //   return new Promise((resolve, reject) => {
  //     const url = URL.createObjectURL(file);
  //     let img = new Image();
  //     img.onload = () => {
  //       resolve(img);
  //     };
  //     img.src = url;
  //   });
  // }

  const getData = async () => {
    const data = await ipcRenderer.invoke("getBotData");
    setList(data);
  };

  useEffect(() => {
    getData();
    // init();
    // const context = canvas.current.getContext("2d");
    // console.log(options);

    // context.save();
  }, []);

  const onChange = (key: string) => {
    console.log(key);
  };

  const { createCanvas, loadImage } = require("canvas");
  const { scanImageData } = require("zbar.wasm");

  const getImageData = async (src: string) => {
    const img = await loadImage(src);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  };

  const url = "file:///Users/lync/Desktop/test/file_11.jpg";
  const main = async () => {
    const img = await getImageData(url);
    const res = await scanImageData(img);
    console.log(res[0].typeName); // ZBAR_QRCODE
    console.log(res[0].decode()); // Hello World
  };

  function print() {
    printCmnd({img1, img2})
  }

  main();
  const canvas: any = useRef(null);
  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Công cụ ảnh" key="1">
          <div className="img-list">
            {list.map((e, i) => {
              const { photo_link } = e;
              return (
                <img
                  className={`img-item ${
                    selected.index === i ? "selected" : ""
                  }`}
                  src={photo_link}
                  alt="thumb"
                  onClick={() => setSelected({ index: i, url: photo_link })}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", padding: "12px" }}>
            <div>
              <PhotoCrop
                url={selected.url}
                outputCanvas={canvas.current}
                onImg1={setImg1}
                onImg2={setImg2}
                onPrint={print}
              />
            </div>
            <div style={{ paddingLeft: "15px", paddingTop: "37px" }}>
              <canvas ref={canvas} />
              <div>
                <img
                  className={`img-item`}
                  src={img1 ? img1 : "no-photo.png"}
                  alt="thumb"
                />
                <img
                  className={`img-item`}
                  src={img2 ? img2 : "no-photo.png"}
                  alt="thumb"
                />
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
export default CongCuAnh;
