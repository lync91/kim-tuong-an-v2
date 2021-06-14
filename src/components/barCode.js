import React from 'react';
import Barcode from 'react-barcode';
export default function BarCodeComponent(props) {
    const { value } = props;
    return (<Barcode value={value} />);
}