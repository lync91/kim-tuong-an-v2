import React, { useRef, useEffect } from "react";
import { Form, InputNumber, Modal } from 'antd';
import Keyboard from 'react-simple-keyboard';
import { camThemTien } from '../utils/db';
export default function ModalCamThem(props: any) {
    const { camdoData, change, onChange, visible, onSubmit, onCancel } = props;
    const {songay, laisuat, tiencam, tienlaidukien} = camdoData;
    const [formCamThem] = Form.useForm();
    const keyboard: any = useRef();
    useEffect(() => {
        formCamThem.setFieldsValue({ tiencamthem: '' });
        if (keyboard.current) keyboard.current.setInput('');
    }, [change]);
    const keyBoardChange = (e: string) => {
        formCamThem.setFieldsValue({ tiencamthem: e })
        onChange(e);
    }
    const formChange = (e: any) => onChange(e.tiencamthem);
    const camThemOK = () => {
        const tiencamthem = Number(formCamThem.getFieldValue('tiencamthem'));
        onSubmit(tiencamthem);
    };
    return (
        <>
            <Modal title="Cầm thêm tiền"
                visible={visible}
                onOk={camThemOK}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={onCancel}
            >
                <p>Số ngày cầm: <b>{songay}</b></p>
                <p>lãi suất: <b>{laisuat}%</b></p>
                <p>Tiền cầm: <b>{`${tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
                <p>Tiền lãi: <b>{`${tienlaidukien}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
                {/* <p>Tiền chuộc: <b>{`${form.getFieldValue('tienchuoc')}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p> */}
                Số tiền cầm thêm: <b></b>
                <Form form={formCamThem} onChange={formChange}>
                    <Form.Item name="tiencamthem">
                        <InputNumber 
                            style={{ width: 300 }} 
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                            parser={(value:any) => value.replace(/\$\s?|(,*)/g, '')} />
                    </Form.Item>
                </Form>
                <Keyboard
                    keyboardRef={(r: any) => (keyboard.current = r)}
                    className="numKeyboard"
                    layout={{
                        default: ["1 2 3", "4 5 6", "7 8 9", "000 0 {bksp}", "-"]
                    }}
                    theme="hg-theme-default hg-layout-numeric numeric-theme"
                    onChange={keyBoardChange}
                />
            </Modal>
        </>
    )
}