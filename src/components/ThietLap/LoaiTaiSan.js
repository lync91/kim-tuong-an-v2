import React, { useState, useEffect } from "react";
import { PageHeader, Button, Row, Col } from "antd";
import {
  DataSheetGrid,
  textColumn,
  keyColumn,
} from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";
import { ipcRenderer } from "electron";
import { useDebounce } from "../../utils/hooks";

export function LoaiTaiSan() {
  const [data, setData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [operation, setOperation] = useState(null);
  const deBounce = useDebounce(data, 500);
  useEffect(() => {
    const getLoaiTaiSan = async () => {
      const _data = await ipcRenderer.invoke('getLoaiTaiSan');
      _data ? setData(_data) : setData([]);
    }
    getLoaiTaiSan();
  }, []);

  useEffect(() => {
    if (!operation) return;
    // const {row} = selectedCell;
    const {fromRowIndex, toRowIndex} = operation;
    console.log(fromRowIndex);
    const rowData = data.slice(fromRowIndex, toRowIndex);
    console.log(rowData);
    if (deBounce) ipcRenderer.invoke('updateLoaiTaiSan', rowData[0])
  }, [deBounce])

  const columns = [
    { ...keyColumn("id", textColumn), title: "ID" },
    { ...keyColumn("loaitaisan", textColumn), title: "Loại tài sản" },
    { ...keyColumn("laisuat", textColumn), title: "Lãi suất" },
  ];
  const _onChange = (v, o) => {
    setOperation(o[0]);
    setData(v);
  }

  const _onActiveCellChange = ({cell}) => {
    console.log(cell);
    setSelectedCell(cell);
  }

  const _createRow = async () => {
    const r = await ipcRenderer.invoke('addLoaiTaiSan');
    console.log(r);
    setData(r);
  }
  return (
    <>
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          title="Thiết lập loại tài sản"
          extra={[
            <Button key="1" type="primary">
              Primary
            </Button>,
          ]}
        ></PageHeader>
        <div>
          <Row>
            <Col span={12}>
              <DataSheetGrid
                value={data}
                onChange={_onChange}
                columns={columns}
                createRow={_createRow}
                autoAddRow={true}
                disableContextMenu={true}
                disableExpandSelection={true}
                height={800}
                onActiveCellChange={_onActiveCellChange}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
