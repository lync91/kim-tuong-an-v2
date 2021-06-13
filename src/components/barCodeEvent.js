import React from 'react';
import BarcodeReader from 'react-barcode-reader';
export default function BarCodeEvent(props) {
    const {handleError, handleScan} = props;
    return (
        <BarcodeReader
        onError={handleError}
        onScan={handleScan}
      />
    )

}