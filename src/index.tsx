import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
// import { vi_Vn } from './locale.js';
import vi_Vn from 'antd/lib/locale-provider/vi_VN'



ReactDOM.render(
  <ConfigProvider locale={vi_Vn}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
