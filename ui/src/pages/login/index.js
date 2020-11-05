import React, { useState } from 'react'
import { Form, Input, Tabs, message, Upload } from 'antd'
import { SegmentedControl, InputItem, Button } from 'antd-mobile'
import request from '@/utils/request';
// import style from './index.less'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js'
import NodeRSA from 'node-rsa'



function RSAEncrypt(data) {
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


export default (props) => {
    const [currentKey, setCurrentKey] = useState('login')
    const [values, setValues] = useState({})

    // 登录
    function submit() {
        const data = { ...values }
        data.password = RSAEncrypt(values.password)
        request({
            url: '/user/login',
            method: 'POST',
            data
        }).then(res => {
            if (res && res.success) {
                localStorage.setItem("userInfo", JSON.stringify(res.data))
                props.history.push('/home')
            }
        })
    };

    // 注册
    function submit2() {
        const data = { ...values }
        data.password = RSAEncrypt(values.password)
        data.confirm = RSAEncrypt(values.confirm)
        request({
            url: '/user/signUp',
            method: 'POST',
            data
        }).then(res => {
            if (res && res.success) {
                message.success('注册成功')
                setCurrentKey('login')
            }
        })
    };
    // 输入变化时
    function handleChange(val, field) {
        values[field] = val
        setValues({ ...values })
    }

    return (
        <div style={{ height: '100%', backgroundColor: '#fff', paddingTop: '60%' }}>

            <SegmentedControl
                style={{ marginBottom: '0.5rem' }}
                values={['login', 'signup']}
                onValueChange={(key) => {
                    setCurrentKey(key)
                }}
            />
            {currentKey === 'login' &&
                <div>
                    <InputItem
                        // value={input}
                        onChange={val => handleChange(val, 'username')}
                        placeholder='...'
                    >
                        Username
                    </InputItem>
                    <InputItem
                        type='password'
                        onChange={val => handleChange(val, 'password')}
                        placeholder='...'
                    >
                        Password
                    </InputItem>
                    <Button type='primary' onClick={submit}>Login</Button>
                </div>
            }
            {currentKey === 'signup' &&
                <div>
                    <InputItem
                        // value={input}
                        onChange={val => handleChange(val, 'username')}
                        placeholder='...'
                    >
                        Username
                    </InputItem>
                    <InputItem
                        type='password'
                        onChange={val => handleChange(val, 'password')}
                        placeholder='...'
                    >
                        Password
                    </InputItem>
                    <InputItem
                        type='confirm'
                        onChange={val => handleChange(val, 'confirm')}
                        placeholder='...'
                    >
                        Confirm
                    </InputItem>
                    <Button type='primary' onClick={submit2}>Sign up</Button>
                </div>
            }
        </div >
    )
}