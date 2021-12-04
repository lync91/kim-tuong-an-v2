import React, { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
// import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import BangThongKe from '../components/bangThongKe';
import { ipcRenderer } from 'electron';
import ChiTiet from '../components/chitiet';

function ThongKe() {
  const [table, updateTable] = useState([]);
  const [curRow, setCurRow] = useState({ id: '' });
  const [visible, setVisible] = useState(false);
  const getData = (key: string) => {
    let dt = [];
    ipcRenderer.invoke('getdata').then((result) => {
      dt = result;
      updateTable(dt.filter((e: any) => e.dahuy !== 1 && e.tenkhach !== ""))
    })
  }
  useEffect(() => {
    getData('tatca');
  }, []);
  const _selectRow = async (r: any) => {
    await setCurRow(r);
    setVisible(true);
  }
  const onClose = (isSave: boolean) => {
    // timPhieubyID(curRow.id, (res: any) => {
    //   setCurKey(res)
    // })
    if (isSave) getData('all');
    setVisible(false);
  };
  const onSearched = (data: any) => {
    setCurRow(data)
  }
  return (
    <div>
      <Drawer
        title="Thông tin cầm đồ"
        placement="right"
        closable={true}
        visible={visible}
        onClose={() => onClose(false)}
        width={720}
      >
        <ChiTiet data={curRow} close={onClose} quetphieu={false} onSearched={onSearched} />
      </Drawer>
      <Layout className="layout-thongke" style={{ padding: 5 }}>
        <BangThongKe data={table} onSelectRow={_selectRow} />
      </Layout>
    </div>
  );
}

export default ThongKe;
