import React, { useEffect, useState } from "react";
import { PageHeader, Button, Row, Col } from "antd";
import { ipcRenderer } from "electron";
import { useWindowSize } from "../../utils/hooks";
import { DataSheetGrid, textColumn, keyColumn, vndColumn } from "../DataSheetGrid";

interface RutTien {
  hanngach: number;
  loaithe: string;
  cuocphi: number;
}

interface ChuyenTien {
  hanngach: number;
  cuocphi: number;
}

export function Barem() {
  const [chuyentienData, setChuyenTienData] = useState<any>();
  const [ruttienData, setRutTienData] = useState<any>();
  const wSize = useWindowSize();
  useEffect(() => {
    console.log(wSize);
    const init = async () => {
      const _chuyen: ChuyenTien = await ipcRenderer.invoke(
        "getBaremChuyentien"
      );
      setChuyenTienData(_chuyen);
      const _rut: RutTien = await ipcRenderer.invoke("getBaremRuttien");
      setRutTienData(_rut);
    };
    init();
  }, [wSize]);
  const rutColumns = [
    { ...keyColumn("hanngach", vndColumn), title: "Hạn ngạch" },
    { ...keyColumn("loaithe", textColumn), title: "Loại thẻ" },
    { ...keyColumn("cuocphi", vndColumn), title: "Cước phí" },
  ];

  const chuyenColumns = [
    { ...keyColumn("hanngach", vndColumn), title: "Hạn ngạch" },
    { ...keyColumn("cuocphi", vndColumn), title: "Cước phí" },
  ];

  const _rutChange = async (data: any[]) => {
    const res = await ipcRenderer.invoke("setBaremRuttien", data);
  };

  const _chuyenChange = async (data: any[]) => {
    const res = await ipcRenderer.invoke("setBaremChuyentien", data);
  };
  return (
    <>
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={false}
          title="Thiết lập barem chuyển rút tiền"
          extra={[
            <Button key="1" type="primary">
              Primary
            </Button>,
          ]}
        ></PageHeader>
        <div>
          <Row>
            <Col span={12}>
              <div
                className="camdo-label"
                style={{ background: "antiquewhite" }}
              >
                Rút tiền
              </div>
              <DataSheetGrid
                value={ruttienData}
                columns={rutColumns}
                onChange={_rutChange}
                height={wSize.height ? wSize.height - 220 : 100}
              />
            </Col>
            <Col span={12}>
              <div className="camdo-label" style={{ background: "#d7fae5" }}>
                Chuyển tiền
              </div>
              <DataSheetGrid
                value={chuyentienData}
                columns={chuyenColumns}
                onChange={_chuyenChange}
                height={wSize.height ? wSize.height - 220 : 100}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
