import React, { useState, useEffect } from "react";
import { DataSheetGrid, textColumn, keyColumn } from "react-datasheet-grid";
import { ipcRenderer } from "electron";
import { useDebounce } from "../../utils/hooks";

export function DataSheet({
  value,
  createRow,
  columns,
  onChange,
  height,
}: any) {
  const [data, setData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [operation, setOperation] = useState(null);
  const deBounce = useDebounce(data, 500);

  useEffect(() => {
    setData(value);
  }, [value]);

  useEffect(() => {
    if (!operation) return;
    // const {row} = selectedCell;
    const { fromRowIndex, toRowIndex } = operation;
    // const rowData = data.slice(fromRowIndex, toRowIndex);
    if (deBounce) {
      if (onChange) onChange(data);
    }
  }, [deBounce]);

  const _onChange = (v: any, o: any) => {
    setOperation(o[0]);
    setData(v);
  };

  const _onActiveCellChange = ({ cell }: any) => {
    // console.log(cell);
    setSelectedCell(cell);
  };

  const _createRow = () => {
    if (!createRow) return {};
    // const r = await ipcRenderer.invoke("addLoaiTaiSan");
    // console.log(r);
    // setData(r);
    // return r[0];
    // createRow();
    return {};
  };
  return (
    <>
      <DataSheetGrid
        value={data}
        onChange={_onChange}
        columns={columns}
        createRow={_createRow}
        autoAddRow={true}
        disableContextMenu={true}
        disableExpandSelection={true}
        height={height ? height : 200}
        onActiveCellChange={_onActiveCellChange}
      />
    </>
  );
}
