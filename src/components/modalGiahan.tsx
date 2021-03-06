import React, { useRef, useEffect, useState, useMemo } from "react";
import { Form, InputNumber, Input, Modal, Switch } from 'antd';
import { Camdo } from "../types/camdo";
import NumPad from "./numpad";
import { isNumeric, round } from "mathjs";
import moment from "moment";

const defInput = {
    ngayTinhLai: "30",
    thangTinhLai: "1",
    songay: "30",
}

export default function ModalGiaHan(props: any) {
    const { camdoData, rowId, visible, onCancel, onOK } = props;
    const [form] = Form.useForm();
    const [tinhlaiTheoThang, setTinhLaiTheoThang] = useState(false);
    const [inputName, setInputName] = useState("");
    const [input, setInput] = useState(defInput);
    const [curInput, setCurInput] = useState("")
    const { songay, tiencam, laisuat, tienlaidukien } = camdoData;
    useEffect(() => {
        const {songay, tiencam} = camdoData;
        const _ngaytinhlai = Math.round(Number(songay)/30)*30;
        console.log(songay);
        const inputObj = {...defInput,...{ngayTinhLai: `${_ngaytinhlai}`, tienlaidukien: `${tiencam * 3 * _ngaytinhlai / (100 * 30)}`}}
        form.setFieldsValue(inputObj);
        setCurInput('');
        setInputName('')
    }, [camdoData]);

    const onChangeAll = (inputObj: any) => {
        const {tiencam} = camdoData;
        setInput({ ...inputObj });
        if (inputName === 'ngayTinhLai') inputObj.tienlaidukien = tiencam * 3 * inputObj.ngayTinhLai / (100 * 30) > 0 ? tiencam * 3 * inputObj.ngayTinhLai / (100 * 30) : 0
        form.setFieldsValue(inputObj);
    }

    const _setInput = (e: any) => {
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
    const onFormChange = () => {
        const {tiencam} = camdoData;
        const songaytinhlai = form.getFieldValue("ngayTinhLai");
        console.log(songaytinhlai);
        form.setFieldsValue({tienlaidukien: tiencam * 3 * songaytinhlai / (100 * 30) > 0 ? tiencam * 3 * songaytinhlai / (100 * 30) : 0})
        setInput(form.getFieldsValue())
    }
    return (
        <>
            <Modal title="Gia h???n phi???u chu???c"
                visible={visible}
                onOk={_onOK}
                okText="X??c nh???n"
                cancelText="H???y"
                onCancel={onCancel}
            >
                <p>S??? ng??y c???m: <b>{songay}</b></p>
                <p>l??i su???t: <b>{laisuat}%</b></p>
                <p>Ti???n c???m: <b>{`${tiencam}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ??</b></p>
                <Form className="form-giahan" form={form} initialValues={defInput} onChange={onFormChange}>
                    <Form.Item hidden label="T??nh l??i theo" name="tinhlaiTheoThang" >
                        <Switch checkedChildren="Th??ng" unCheckedChildren="Ng??y" onChange={(e: boolean) => setTinhLaiTheoThang(e)}></Switch>
                    </Form.Item>
                    <Form.Item hidden={tinhlaiTheoThang} label="S??? ng??y t??nh l??i" name="ngayTinhLai">
                        <InputNumber style={{ width: 160 }} onFocus={_setInput} />
                    </Form.Item>
                    <Form.Item hidden={!tinhlaiTheoThang} label="S??? th??ng t??nh l??i" name="thangTinhLai">
                        <InputNumber style={{ width: 160 }} onFocus={_setInput} />
                    </Form.Item>
                    <Form.Item label="Ti???n l??i" name="tienlaidukien">
                        <InputNumber style={{ width: 160 }} defaultValue={tienlaidukien} formatter={value => `${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ??`} disabled></InputNumber>
                    </Form.Item>
                    <Form.Item label="S??? ng??y gia h???n" name="songay">
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