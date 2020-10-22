import React, { useState } from 'react'
import { Form, Button, Input, Tabs, message } from 'antd'
import request from '@/utils/request';
import style from './index.less'



export default function Login(props: any) {
    const [currentKey, setCurrentKey] = useState('1')
    function onFinish(values: any) {
        request({
            url: '/login',
            method: 'POST',
            data: values
        }).then(res => {
            if (res && res.success) {
                localStorage.setItem("userInfo", JSON.stringify(res.data))
                props.history.push('/home')
            }
        })
    };
    function onFinish2(values: any) {
        request({
            url: '/signUp',
            method: 'POST',
            data: values
        }).then(res => {
            if (res && res.success) {
                message.success('注册成功')
                setCurrentKey('1')
            }
        })
    };
    return (
        <div className={style.login}>
            <Tabs activeKey={currentKey} onChange={key => setCurrentKey(key)}>
                <Tabs.TabPane tab='登录' key="1" >
                    <Form
                        name="basic"
                        initialValues={{}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit">登录</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>

                <Tabs.TabPane tab='注册' key="2" >
                    <Form
                        name="basic"
                        initialValues={{}}
                        onFinish={onFinish2}
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="确认密码"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('密码不一致');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit">注册</Button>
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>
            </Tabs>

        </div >
    )
}