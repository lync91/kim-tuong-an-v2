import React, { useRef, useEffect, useState, useMemo } from "react";
import { Form, InputNumber, Input, Modal, Switch } from 'antd';
import { Camdo } from "../types/camdo";
import NumPad from "./numpad";
import { round } from "mathjs";
import moment from "moment";

const defInput = {
    ngayTinhLai: "30",
    thangTinhLai: "1",
    songay: "30",
}

export default function ModalGiaHan(props: any) {
    const { songay, laisuat, tiencam, tienlaidukien, ngayTinhLai, rowId, visible, onCancel, onOK } = props;
    const [form] = Form.useForm();
    const [tinhlaiTheoThang, setTinhLaiTheoThang] = useState(false);
    const [inputName, setInputName] = useState("");
    const [input, setInput] = useState(defInput);
    const [curInput, setCurInput] = useState("")
    // const [rowID, setRowID] = useState(0);
    useMemo(() => {
        // setInputName('ngayTinhLai');
        // console.log('OKKKKKK');
        form.setFieldsValue({tienlaidukien: tienlaidukien});
        // setInput(defInput);
    }, [tienlaidukien])
    useEffect(() => {
        const _ngaytinhlai = `${ngayTinhLai ? round((Number(moment().format('X')) - ngayTinhLai.format('X')) / (60 * 60     * 24)) + 1 : 0}`;
        form.setFieldsValue({...defInput,...{ngayTinhLai: _ngaytinhlai}});
        setCurInput('');
        setInputName('')
    }, [rowId]);

    const onChangeAll = (inputObj: any) => {
        setInput({ ...inputObj });
        if (inputName === 'ngayTinhLai') inputObj.tienlaidukien = tiencam * 3 * inputObj.ngayTinhLai / (100 * 30) > 0 ? tiencam * 3 * inputObj.ngayTinhLai / (100 * 30) : 0
        form.setFieldsValue(inputObj);
    }

    const _setInput = (e: any) => {
        console.log({...input, [e.target.id]: form.getFieldValue(e.target.id)});
        
        setInput({...input, [e.target.id]: form.getFieldValue(e.target.id)})
        setInputName(e.target.id);
        setCurInput(form.getFieldValue(e.target.id));
    }

    const onKeyPress = (button: any) => {
        console.log("Button pressed", button);
    };

    const _onOK = () => {
        const data = form.getFieldsValue();
        onOK(data);
    }
    return (
        <>
            <Modal title="Gia hạn phiếu chuộc"
                visible={visible}
                onOk={_onOK}
                okText="Xác nhận"
                cancelText="Hủy"
                onCancel={onCancel}
            >
                <p>Số ngày cầm: <b>{songay}</b></p>
                <p>lãi suất: <b>{laisuat}%</b></p>
                <p>Tiền cầm: <b>{`${tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ</b></p>
                <Form form={form} initialValues={defInput}>
                    <Form.Item hidden label="Tính lãi theo" name="tinhlaiTheoThang" >
                        <Switch checkedChildren="Tháng" unCheckedChildren="Ngày" onChange={(e: boolean) => setTinhLaiTheoThang(e)}></Switch>
                    </Form.Item>
                    <Form.Item hidden={tinhlaiTheoThang} label="Số ngày tính lãi" name="ngayTinhLai">
                        <InputNumber style={{ width: 160 }} onFocus={_setInput} />
                    </Form.Item>
                    <Form.Item hidden={!tinhlaiTheoThang} label="Số tháng tính lãi" name="thangTinhLai">
                        <InputNumber style={{ width: 160 }} onFocus={_setInput} />
                    </Form.Item>
                    <Form.Item label="Tiền lãi" name="tienlaidukien">
                        <InputNumber style={{ width: 160 }} defaultValue={tienlaidukien} formatter={value => `${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`} disabled></InputNumber>
                    </Form.Item>
                    <Form.Item label="Số ngày gia hạn" name="songay">
                        <InputNumber style={{ width: 160 }} onFocus={_setInput} />
                    </Form.Item>
                </Form>
                <div>
                    <NumPad
                        inputName={inputName}
                        onChangeAll={onChangeAll}
                        onKeyPress={onKeyPress}
                        input={input}
                        rowId={rowId}
                        curInput={curInput}
                    ></NumPad>
                </div>
            </Modal>
        </>
    )
}