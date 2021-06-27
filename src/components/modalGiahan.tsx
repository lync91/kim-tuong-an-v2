import React, { useRef, useEffect, useState } from "react";
import { Form, InputNumber, Modal, Switch } from 'antd';
import { Camdo } from "../types/camdo";
import NumPad from "./numpad";

const defInput = {
    tenkhach: "",
    dienthoai: "",
    monhang: "",
    loaivang: "",
    tongtrongluong: "",
    trongluonghot: "",
    tiencam: ""
}

export default function ModalGiaHan(props: any) {
    const { songay, laisuat, tiencam, tienlaidukien, change, onChange, visible, onSubmit, onCancel } = props;
    const [form] = Form.useForm();
    const keyboard: any = useRef();
    const [tinhlaiTheoThang, setTinhLaiTheoThang] = useState(false);
    const [soThangTinhLai, setSoThangTinhLai] = useState(1);
    const [ngayGiaHan, setNgayGiaHan] = useState(30);
    const [inputName, setInputName] = useState("soThangTinhLai");
    const [input, setInput] = useState(defInput);
    const [rowID, setRowID] = useState(0);
    useEffect(() => {
        form.setFieldsValue({ tiencamthem: '' });
        if (keyboard.current) keyboard.current.setInput('');
    }, [change]);
    const keyBoardChange = (e: string) => {
        form.setFieldsValue({ tiencamthem: e })
        onChange(e);
    }
    const formChange = (e: any) => onChange(e.tiencamthem);
    const camThemOK = () => {
        const tiencamthem = Number(form.getFieldValue('tiencamthem'));
        onSubmit(tiencamthem);
    };
    const giaHanOK = () => {
        
    }

    const onChangeAll = async (inputObj: any) => {
        console.log(inputObj);

        setInput(inputObj);
        // const calc = defData.update({...form.getFieldsValue(), ...inputObj}).calc();
        // const _data = await form.getFieldsValue();
        // const data = defData.update(inputObj);
        // const calc = data.calc().calcObj();
        // console.log(calc);
        console.log('values', form.getFieldsValue());

        form.setFieldsValue(inputObj);
        // setFormData({..._data, ...inputObj,...calc});
    }

    const _setInput = (e: any) => {
        setInputName(e.target.id)
    }

    const onKeyPress = (button: any) => {
        console.log("Button pressed", button);
    };
    return (
        <>
            <Modal title="Gia hạn phiếu chuộc"
                visible={visible}
                onOk={giaHanOK}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={onCancel}
            >
                <p>Số ngày cầm: <b>{songay}</b></p>
                <p>lãi suất: <b>{laisuat}%</b></p>
                <p>Tiền cầm: <b>{`${tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
                <Form form={form}>
                    <Form.Item label="Tính lãi theo" name="tinhlaiTheoThang" >
                        <Switch checkedChildren="Tháng" unCheckedChildren="Ngày" onChange={(e: boolean) => setTinhLaiTheoThang(e)}></Switch>
                    </Form.Item>
                    <Form.Item hidden={tinhlaiTheoThang} label="Số ngày tính lãi" name="ngayTinhLai">
                        <InputNumber defaultValue={30} disabled />
                    </Form.Item>
                    <Form.Item hidden={!tinhlaiTheoThang} label="Số tháng tính lãi" name="thangTinhLai">
                        <InputNumber defaultValue={soThangTinhLai} onFocus={_setInput} />
                    </Form.Item>
                    <Form.Item label="Tiền lãi" name="tienlaidukien">
                        <InputNumber defaultValue={tienlaidukien} formatter={value => `${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`} disabled></InputNumber>
                    </Form.Item>
                    <Form.Item label="Số ngày gia hạn" name="songay">
                        <InputNumber defaultValue={30} onFocus={_setInput} />
                    </Form.Item>
                </Form>
                <div>
                    <NumPad
                        inputName={inputName}
                        onChangeAll={onChangeAll}
                        onKeyPress={onKeyPress}
                        input={input}
                        rowId={rowID}
                    ></NumPad>
                </div>
            </Modal>
        </>
    )
}