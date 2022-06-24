import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';

import {
  Layout,
  Button,
  Menu,
} from 'antd';

import Home from './Home';
import ThietLap from './ThietLap';
import {
  PieChartOutlined,
  FormatPainterOutlined,
  ScanOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

import '../assets/css/App.css'

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/about">
                <Home />
              </Route>
            </Switch>
    </Router>
  )
}

export default App
