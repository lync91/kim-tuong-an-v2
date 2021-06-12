import React, { useState, useEffect } from 'react';
import { PageHeader, Layout, Radio, Form, Drawer, Input, Switch } from 'antd';
// import { SaveTwoTone, PrinterTwoTone, ProjectOutlined } from '@ant-design/icons';
import BangThongKe from '../components/bangThongKe';
import { getCamDo, timKiem, timTudo, timPhieubyID } from '../utils/db';
import ChiTiet from '../components/chitiet';


const { Search } = Input;

const defData = {
  key: 'tatca'
}

function ThongKe() {
  const [table, updateTable] = useState([]);
  const [curRow, setCurRow] = useState({id: ''});
  const [curKey, setCurKey] = useState('tatca')
  const [visible, setVisible] = useState(false);
  const [chitimTuDo, setChitimTuDo] = useState(false)
  const [form] = Form.useForm();
  const getData = (key: string) => {
    getCamDo(key, (res: any) => updateTable(res));
  }
  useEffect(() => {
    getData('tatca');
    form.setFieldsValue(defData)
  }, []);
  const onKeyChange = (e: any) => {
    setCurKey(e.key);
    getCamDo(e.key, (res: any) => updateTable(res));
  }
  const _selectRow = async (r: any) => {
    await setCurRow(r);
    setVisible(true);
  }
  const onClose = () => {
    // console.log(reload);
    // if (reload) getData(curKey);
    timPhieubyID(curRow.id, (res: any) => {
      // console.log(res);
      // updateTable(table.forEach(e => e.id === res[0].id ? res[0] : e))
      setCurKey(res)
    })
    setVisible(false);
  };
  const onSearch = (e: string) => {
    if (chitimTuDo) {
      timTudo(e, (res: any) => updateTable(res))
    } else {
      timKiem(e, (res: any) => {
        updateTable(res)
      })
    }
  }
  const onSearched = (data: any) => {
    setCurRow(data)
  }
  const swTimtudo = (e: any) => {
    setChitimTuDo(e);
  }
  return (
    <div>
      <Drawer
        title="Thông tin cầm đồ"
        placement="right"
        closable={true}
        visible={visible}
        onClose={onClose}
        width={720}
      >
        <ChiTiet data={curRow} close={onClose} quetphieu={false} onSearched={onSearched} />
      </Drawer>
      {/* <PageHeader className="site-page-header"
        onBack={
          () => null}
        title="Quản lý dữ liệu"
        subTitle=""
        extra={
          (<Form form={form} onValuesChange={onKeyChange} layout="inline" >
            <Form.Item name="timtudo" label="Chỉ tìm tủ đồ">
              <Switch onChange={swTimtudo} />
            </Form.Item>
            <Form.Item name="search" >
              <Search
                placeholder="Tìm kiếm"
                allowClear
                onSearch={onSearch} />
            </Form.Item>
            <Form.Item name="key">
              <Radio.Group key='1' >
                <Radio.Button key='5' value="tatca">Tất cả</Radio.Button>
                <Radio.Button key='2' value="conhan">Còn hạn</Radio.Button>
                <Radio.Button key='3' value="quahan">Quá hạn</Radio.Button>
                <Radio.Button key='4' value="dachuoc">Đã chuộc</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
          )}
      /> */}
      <Layout className="layout-thongke" style={{ padding: 5 }}>
        <BangThongKe data={table} onSelectRow={_selectRow} />
      </Layout>
    </div>
  );
}

export default ThongKe;
