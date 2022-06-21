import React from 'react';
import Barcode from 'react-barcode';
export default function BarCodeComponent(props) {
    const { value } = props;
    return (<Barcode width="1" height="50" value={value} />);
}