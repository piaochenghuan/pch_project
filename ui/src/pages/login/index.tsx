import React, { useState } from 'react'
import { Form, Button, Input, Tabs, message, Upload } from 'antd'
import request from '@/utils/request';
import style from './index.less'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js'
import NodeRSA from 'node-rsa'



function RSAEncrypt(data: string) {
    const key = new NodeRSA(`-----BEGIN RSA PUBLIC KEY-----
    MEgCQQDxSSeGRtiBWSTg9OR5czbgedCEh757xGVaVsES2JjoHudDp+XPt1DmAIcR
    zHw84RqeaHYimVSO3mnEF3bW3kJZAgMBAAE=
    -----END RSA PUBLIC KEY-----`);
    let encrypted = key.encrypt(data, 'base64');
    return encrypted;
}

//aes加密方法
// function encrypt(data: string) {
//     const key = CryptoJS.enc.Utf8.parse("1111111111111111");  //十六位十六进制数作为密钥
//     const iv = CryptoJS.enc.Utf8.parse('2222222222222222');   //十六位十六进制数作为密钥偏移量

//     let srcs = CryptoJS.enc.Utf8.parse(data);
//     let encrypted = CryptoJS.AES.encrypt(srcs, key, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return encrypted.ciphertext.toString()
// }


export default function Login(props: any) {
    const [currentKey, setCurrentKey] = useState('1')
    const [imageUrl, setImageUrl] = useState()
    const [loading, setLoading] = useState(false)
    function onFinish(values: any) {
        values.password = RSAEncrypt(values.password)
        debugger
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

        values.password = RSAEncrypt(values.password)
        values.confirm = RSAEncrypt(values.confirm)
        request({
            url: '/signUp',
            method: 'POST',
            data: {
                ...values,
                avatarUrl: imageUrl || null
            }
        }).then(res => {
            if (res && res.success) {
                message.success('注册成功')
                setCurrentKey('1')
            }
        })
    };



    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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
                        <Form.Item
                            name="avatar"
                            label="上传头像"
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                showUploadList={false}
                                action="http://127.0.0.1:3000/user/uploadAvatar"
                                // beforeUpload={beforeUpload}
                                onChange={(info) => {
                                    if (info.file.status === 'uploading') {
                                        setLoading(true)
                                        return;
                                    }
                                    if (info.file.status === 'done') {
                                        setImageUrl(info.file.response.data.url)
                                        setLoading(false)
                                    }
                                }}
                            >
                                {imageUrl ? <img src={'http://127.0.0.1:3000' + imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
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