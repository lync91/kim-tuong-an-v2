import React from 'react';
import { Button, Form, Input } from 'antd';
import { settingsTypes } from '../types/camdo';

function GiaVang(props: { data: settingsTypes, onUpdate: any }) {
    const [form] = Form.useForm();
    const { data, onUpdate } = props;
    const _Click = () => {
        onUpdate(form.getFieldsValue());
    }
    return (
        <>
            <Form
                form={form}
                labelCol={
                    {
                        span: 4,
                    }
                }
                wrapperCol={
                    {
                        span: 16,
                    }
                }
                initialValues={data}
                layout="horizontal" >
                <Form.Item name="gia610" label="610" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="gia980" label="980" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="gia9999" label="9999" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
                    <Button type="primary" htmlType="submit" onClick={_Click} >Lưu</Button>
                </Form.Item>
            </Form>
        </>
    );
}
export default GiaVang;
