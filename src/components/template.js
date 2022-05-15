import moment from 'moment';
import { any } from 'prop-types';
import React, { useEffect, useState } from 'react';
import docso from '../utils/sorachu';

export function TemplatePhieu(props) {
  const { data } = props;
  const [ngaycam, setNgaycam] = useState('');
  const [ngaytinhlai, setNgaytinhlai] = useState('');

  // const [src, setStc] = useState('')
  useEffect(() => {
  }, []);
  return (
    <div className="row">
      <div className="column center" >
        <p><b>{data.ngayCamChuoc[0].format('h:m A')}</b></p>
        <img style={{ width: '100px' }} src={data.src} />
        <p style={{fontSize: 28, marginTop: 2, marginBottom: 2}}><b>{data.sophieu}</b></p>
        <p style={{fontSize: 28, margin: 2}}><b>{data.tenkhach}</b></p>
        <p style={{margin: 2}}><b>{`${data.monhang} (${data.loaivang})`}</b></p>
        <p style={{margin: 2}}><b>{data.trongluongthuc} chỉ</b></p>
        <p style={{margin: 2}}><b>{`${data.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</b></p>
        <p style={{margin: 2}}><b>{data.ngayCamChuoc[0].format('DD/MM/YYYY')}</b></p>
      </div>
      <div className="column" style={{paddingLeft: 100, width: '75%'}} >
        <h2></h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className="bar-code" style={{position: 'absolute', right: 0, top: 0}}>
          {/* <p><b>{data.ngayCamChuoc[0].format('h:m A')}</b></p> */}
          <img src={data.src} style={{ width: '120px' }} />
          <p style={{fontSize: 18, textAlign:'center', lineHeight: 0.3, paddingTop: "5px", margin: 0}}><b>{data.sophieu}</b></p>
        </div>
        <p style={{marginTop: 22, paddingLeft: 22}}><b>{data.tenkhach}</b></p>
        <p style={{marginTop: 12, paddingLeft: 22}}><b>{`${data.monhang} (${data.loaivang})`}</b> </p>
        <p style={{marginTop: 12, paddingLeft: 22}}> <b>{data.trongluongthuc} chỉ</b></p>
        <p style={{paddingLeft: 20, fontSize: 20, marginTop: 12, marginBottom: 0}}>
          <div style={{position: 'absolute', left: 320, fontSize: 18}}><b>{``}{`${data.tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Đ</b></div>
          <div style={{position: 'absolute', paddingLeft: 28, right: 50, fontSize: 18}} className="bangchu"><b><i>{`    ${docso(data.tiencam)}`} đồng</i></b></div>
          </p>
        
        <p style={{marginTop: 100}}>
          <div style={{position: 'absolute', left: 320}}>
            <b>{data.ngaytinhlai.format('DD/MM/YYYY')}</b>
            {/* <p style={{margin: 2}} hidden={data.ngaycam.format('DD/MM/YYYY') === moment(data.ngaytinhlai).format('DD/MM/YYYY') ? true : false} ><b>({moment(data.ngaytinhlai).format('DD/MM/YYYY')})</b></p> */}
          </div>
          <div style={{position: 'absolute', right: 150}}>
          <b>{data.ngayhethan.format('DD/MM/YYYY')}</b>
          </div>
          </p>
      </div>
    </div>
  )
}

TemplatePhieu.propTypes = any;
export default TemplatePhieu;
