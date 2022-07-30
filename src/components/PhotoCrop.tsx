import React, { useState, useEffect, useRef } from "react";
import {} from "antd";
import Button from "antd-button-color";
import {
  CreditCardOutlined,
  GatewayOutlined,
  IdcardOutlined,
  NumberOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SaveFilled,
  ThunderboltFilled,
} from "@ant-design/icons";

interface pointTypes {
  x: number;
  y: number;
  selected: boolean;
}

const { createCanvas, loadImage } = require("canvas");

export default function PhotoCrop(props: any) {
  const cv: any = require("@techstark/opencv-js");
  const { url, outputCanvas, onImg1, onImg2, onPrint } = props;
  const [options, setOptions] = useState<any>({
    width: 200,
    height: 200,
    pixelRatio: window.devicePixelRatio,
  });
  const [img, setImg] = useState<any>(null);
  const [out, setOut] = useState<any>(null);
  const [points, setPoints] = useState<pointTypes[]>([]);
  const [defPoint, setDefPoint] = useState<pointTypes[]>([]);

  const [style, setStyle] = useState<any>({});
  useEffect(() => {
    // const { width, height, pixelRatio } = options;
    // console.log(pixelRatio);

    // const dw = Math.floor(pixelRatio * width);
    // const dh = Math.floor(pixelRatio * height);
    // setOptions({...options, ...{dh, dw}})
    if (url) {
      init(url);
    }
    // const context = canvas.current.getContext("2d");
    console.log(options);

    // context.save();
  }, [url]);

  function canvasClick(e: any) {
    console.log(e);

    var x = e.pageX - e.target.offsetLeft;
    var y = e.pageY - e.target.offsetTop;
    console.log({ x, y });

    for (var i = 0; i < points.length; i++) {
      console.log(Math.pow(points[i].x - x, 2) + Math.pow(points[i].y - y, 2));

      if (Math.pow(points[i].x - x, 2) + Math.pow(points[i].y - y, 2) < 100) {
        points[i].selected = true;
        console.log(points[i]);
      } else {
        if (points[i].selected) points[i].selected = false;
      }
    }
  }
  function dragCircle(e: any) {
    for (var i = 0; i < points.length; i++)
      if (points[i].selected) {
        points[i].x = e.pageX - e.target.offsetLeft;
        points[i].y = e.pageY - e.target.offsetTop;
        console.log("xxxx1x");
      }
    draw();
  }
  function stopDragging(e: any) {
    for (var i = 0; i < points.length; i++) {
      points[i].selected = false;
    }
    process2();
  }

  const { dh, dw } = options;

  function draw() {
    if (img) {
      const context = canvas.current.getContext("2d");
      context.save();
      context.clearRect(0, 0, canvas.current.width, canvas.current.height);
      context.drawImage(img, 0, 0, dw, dh);
      if (points.length === 4) drawPoints(points);
      context.restore();
    }
  }

  function drawPoints(points: any[]) {
    let context = canvas.current.getContext("2d");
    for (var i = 0; i < points.length; i++) {
      var circle = points[i];

      // 绘制圆圈
      context.globalAlpha = 0.85;
      context.beginPath();
      context.arc(circle.x, circle.y, 7, 0, Math.PI * 2);
      context.fillStyle = i == 0 ? "red" : "yellow";
      context.strokeStyle = "yellow";
      context.lineWidth = 3;
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(circle.x, circle.y);
      context.lineTo(
        points[i - 1 >= 0 ? i - 1 : 3].x,
        points[i - 1 >= 0 ? i - 1 : 3].y
      );
      context.stroke();
    }
  }

  async function init(imUrl: string) {
    //bind events
    console.log(1234);
    // let context = canvas.current.getContext("2d");
    const img = await loadImage(imUrl);
    const { width, height } = img;
    // setOptions({ ...options, ...{ width, height } });
    const { pixelRatio } = options;
    const w = 800;
    const dw = Math.floor(w);
    const dh = Math.floor((height * w) / width);
    setOptions({
      ...options,
      ...{ height, width, dh, dw, scale: w / img.width },
    });
    const points = [
      {
        x: Math.floor(dw / 2 - 300),
        y: Math.floor(dh / 2 - 180),
        selected: false,
      },
      {
        x: Math.floor(dw / 2 + 300),
        y: Math.floor(dh / 2 - 180),
        selected: false,
      },
      {
        x: Math.floor(dw / 2 + 300),
        y: Math.floor(dh / 2 + 180),
        selected: false,
      },
      {
        x: Math.floor(dw / 2 - 300),
        y: Math.floor(dh / 2 + 180),
        selected: false,
      },
    ];
    setPoints(points);
    setDefPoint(JSON.parse(JSON.stringify(points)));
    // context.drawImage(img,0,0,img.width,img.height);
    setImg(img);
    // draw();
    let image = cv.imread(img);
    let dst = new cv.Mat();
    let dsize = new cv.Size(dw, dh);
    cv.resize(image, dst, dsize, 0, 0, cv.INTER_AREA);
    cv.imshow(canvas.current, dst);
    // if (canvas) {
    //   canvas.onmousedown = canvasClick;
    //   canvas.onmouseup = stopDragging;
    //   canvas.onmouseout = stopDragging;
    //   canvas.onmousemove = dragCircle;
    // }
    // switchView("select");
  }

  function process1() {
    let image = cv.imread(img);
    let edges = new cv.Mat();
    cv.Canny(image, edges, 100, 200);
    // cv.imshow($("canvas")[0],edges);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE
    );

    let cnts = [];
    for (let i = 0; i < contours.size(); i++) {
      const tmp = contours.get(i);
      const peri = cv.arcLength(tmp, true);
      let approx = new cv.Mat();

      let result: any = {
        area: cv.contourArea(tmp),
        points: [],
      };

      cv.approxPolyDP(tmp, approx, 0.02 * peri, true);
      const pointsData = approx.data32S;
      for (let j = 0; j < pointsData.length / 2; j++)
        result.points.push({ x: pointsData[2 * j], y: pointsData[2 * j + 1] });

      if (result.points.length === 4) cnts.push(result);
    }
    cnts.sort((a, b) => b.area - a.area);
    const { scale } = options;
    console.log(cnts);
    setPoints(
      cnts[0].points.map(({ x, y }: any) => {
        return { x: x * scale, y: y * scale };
      })
    );
    // drawPoints(cnts[0].points);
  }

  function process2() {
    let image = cv.imread(img);
    const { scale } = options;
    const _points = points.map((e) => {
      return { x: e.x / scale, y: e.y / scale };
    });
    //use window.points & $("canvas") as its input .... TOO STUPID!!!
    const tl = _points[0],
      tr = _points[1],
      br = _points[2],
      bl = _points[3]; //stands for top-left,top-right ....

    const width = Math.max(
      Math.sqrt((br.x - bl.x) ** 2 + (br.y - bl.y) ** 2),
      Math.sqrt((tr.x - tl.x) ** 2 + (tr.y - tl.y) ** 2)
    );

    const height = Math.max(
      Math.sqrt((tr.x - br.x) ** 2 + (tr.y - br.y) ** 2),
      Math.sqrt((tl.x - bl.x) ** 2 + (tl.y - bl.y) ** 2)
    );

    const from = cv.matFromArray(4, 1, cv.CV_32FC2, [
      _points[0].x,
      _points[0].y,
      _points[1].x,
      _points[1].y,
      _points[2].x,
      _points[2].y,
      _points[3].x,
      _points[3].y,
    ]);
    const to = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0,
      0,
      width - 1,
      0,
      width - 1,
      height - 1,
      0,
      height - 1,
    ]);
    const M = cv.getPerspectiveTransform(from, to);
    let out = new cv.Mat();
    let size = new cv.Size();

    size.width = width;
    size.height = height;
    console.log(size);
    cv.warpPerspective(image, out, M, size);
    let dst = new cv.Mat();
    let dsize = new cv.Size(400, Math.floor((height * 400) / width));
    cv.resize(out, dst, dsize, 0, 0, cv.INTER_AREA);
    if (outputCanvas) cv.imshow(outputCanvas, dst);
    setOut(out);
  }

  async function rotate(mode: string) {
    let src = cv.imread(img);
    let dst = new cv.Mat();
    let dsize = new cv.Size(src.rows, src.cols);
    // You can try more different parameters
    cv.rotate(src, dst, cv[mode]);

    const _canvas = createCanvas(dsize.width, dsize.height);
    cv.imshow(_canvas, dst);
    const url = _canvas.toDataURL("image/png");
    init(url);

    let dst1 = new cv.Mat();
    const w = 800;
    const dw = Math.floor(w);
    const dh = Math.floor((dsize.height * w) / dsize.width);
    let dsize1 = new cv.Size(dw, dh);
    cv.resize(dst, dst1, dsize1, 0, 0, cv.INTER_AREA);
    cv.imshow(canvas.current, dst1);
    src.delete();
    dst.delete();
  }

  function resetPoints() {
    console.log("OK");
    console.log(defPoint);
    const points = JSON.parse(JSON.stringify(defPoint));
    setPoints(points);
    // drawPoints(points);
  }

  function onOut(num:number) {
    let dsize = new cv.Size(out.rows, out.cols);
    const _canvas = createCanvas(dsize.width, dsize.height);
    cv.imshow(_canvas, out);
    const url = _canvas.toDataURL("image/png");
    if (num === 1) onImg1(url)
    if (num === 2) onImg2(url)
  }
  const canvas: any = useRef(null);
  return (
    <>
      {img ? (
        <>
          <div className="buttons-bar">
            <Button
              onClick={() => rotate("ROTATE_90_COUNTERCLOCKWISE")}
              icon={<RotateLeftOutlined />}
            >
              Xoay trái
            </Button>
            <Button
              onClick={() => rotate("ROTATE_90_CLOCKWISE")}
              icon={<RotateRightOutlined />}
            >
              Xoay phải
            </Button>
            <Button onClick={process1} icon={<ThunderboltFilled />}>
              Nhận tự động
            </Button>
            <Button onClick={resetPoints} icon={<GatewayOutlined />}>
              Đặt lại
            </Button>
            <Button onClick={() => onOut(1)} icon={<IdcardOutlined />}>
              Mặt trước
            </Button>
            <Button onClick={() => onOut(2)} icon={<CreditCardOutlined />}>
              Mặt sau
            </Button>
            <Button onClick={onPrint} icon={<SaveFilled />} type="success">
              Lưu
            </Button>
          </div>
          <canvas
            ref={canvas}
            width={dw}
            height={dh}
            onMouseDown={canvasClick}
            onMouseUp={stopDragging}
            onMouseOut={stopDragging}
            onMouseMove={dragCircle}
            style={style}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
