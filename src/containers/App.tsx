import React, {useState} from 'react';
import { HashRouter as Router, Switch, Route, Link,  } from 'react-router-dom';
import {
  Layout,
  Button,
  Menu,
} from 'antd';

import Home from './Home';
import BangGiaMain from "./BangGiaMain";
import TaoPhieu from './taoPhieu';
import ThongKe from './ThongKe';
import QuetPhieu from './quetPhieu';
import ThietLap from './ThietLap';
import {
  PieChartOutlined,
  FormatPainterOutlined,
  ScanOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import BarCodeEvent from "../components/barCodeEvent";


import '../assets/css/App.css'
import { ipcRenderer } from 'electron';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [hideSide, setHideSide] = useState(false);
  const handleScan = (data: string) => {
    console.log(data);
    if (data.length > 6) {
    } else {
      ipcRenderer.invoke('doScanned', data);
    }
  };
  const handleError = (err: any) => {
    console.error(err);
  };
  return (
    <Router>
      <Layout>
        <Header hidden>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider hidden={hideSide ? true : false} className="p-5">
            <Link to="/"><Button type="primary" className="m-t-10" size="large" block><PieChartOutlined />Báo cáo</Button></Link>
            <Link to="/taophieu"><Button type="primary" className="m-t-10" size="large" block><FormatPainterOutlined />Cầm đồ</Button></Link>
            {/* <Link to="/camdo"><Button type="primary" className="m-t-10" size="large" block><FormatPainterOutlined />Cầm đồ</Button></Link> */}
            <Link to="/quetphieu"><Button type="primary" className="m-t-10" size="large" block><ScanOutlined />Quét phiếu cầm</Button></Link>
            <Link to="/thongKe"><Button type="primary" className="m-t-10" size="large" block><DatabaseOutlined />Quản lý dữ liệu</Button></Link>
            <Link to="/banggia/false"><Button type="primary" className="m-t-10" size="large" block><DatabaseOutlined />Bảng giá</Button></Link>
            <Link to="/thietlap"><Button type="primary" className="m-t-10" size="large" block><DatabaseOutlined />Cài đặt</Button></Link>
          </Sider>
          <Content style={hideSide ? {marginLeft: 0} : {}}>
          <BarCodeEvent handleError={handleError} handleScan={handleScan} />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/about">
                <Home />
              </Route>
              <Route path="/quetphieu">
                <QuetPhieu />
              </Route>
              <Route path="/taophieu">
                <TaoPhieu />
              </Route>
              <Route path="/camdo">
                <TaoPhieu />
              </Route>
              <Route path="/thongKe">
                <ThongKe />
              </Route>
              <Route path="/thietlap">
                <ThietLap />
              </Route>
              <Route path="/banggia/:iswindow">
                <BangGiaMain onHideSide={(hide: boolean) => setHideSide(hide)} />
              </Route>
            </Switch>
          </Content>
        </Layout>
        <Footer hidden>Footer</Footer>
      </Layout>
    </Router>
  )
}

export default App
