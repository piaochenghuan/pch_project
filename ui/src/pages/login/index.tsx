import React, { useState } from 'react'
import { Form, Button, Input, Checkbox } from 'antd'
import request from '@/utils/request';
import style from './index.less'


export default function Login() {

    const [text, setText] = useState(null)

    const onFinish = (values: any) => {
        request('/login', { method: 'POST', body: JSON.stringify(values) })
    };
    return (
        <div className={style.login}>
            <Form
                name="basic"
                initialValues={{}}
                onFinish={onFinish}

            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">Log in</Button>
                </Form.Item>
            </Form>
        </div >
    )
}