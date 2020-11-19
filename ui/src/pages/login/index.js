import React, { useState, useContext, useRef, useEffect } from 'react'
import { message } from 'antd'
import { SegmentedControl, InputItem, Button } from 'antd-mobile'
import request from '@/utils/request';
// import style from './index.less'
import CryptoJS from 'crypto-js'
import NodeRSA from 'node-rsa'
import { createForm } from 'rc-form';
import { Context } from '@/layouts'
import FormItems from '@/components/FormItems'

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
//     const key = CryptoJS.enc.Utf8.parse("1111111111111111"); //十六位十六进制数作为密钥
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
    const { width, userInfo, setLocalStorage, host } = useContext(Context)
    const formRef = useRef()
    const [index, setIndex] = useState(0)

    useEffect(() => {
        formRef.current.resetFields()
    }, [index])


    // 登录
    function submit() {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                const data = { ...values }
                data.password = RSAEncrypt(data.password)
                request({
                    url: 'userLogin',
                    method: 'POST',
                    data
                }).then(res => {
                    if (res && res.success) {
                        setLocalStorage("userInfo", res.data)
                        props.history.push('/home')
                    }
                })
            } else {
                message.warning('必填')
            }
        })
    };

    // 注册
    function submit2() {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                if (values.password !== values.confirm) {
                    return message.warning('not same')
                }
                const data = { ...values }
                data.password = RSAEncrypt(data.password)
                data.confirm = RSAEncrypt(data.confirm)
                request({
                    url: 'userSignUp',
                    method: 'POST',
                    data
                }).then(res => {
                    if (res && res.success) {
                        message.success('success')
                        setIndex(0)
                    }
                })
            } else {
                message.warning('必填')
            }
        })
    };

    const items = [
        {
            label: 'Username: ',
            name: 'username',
            fieldProps: {
                rules: [{ required: true }]
            }
        },
        {
            type: 'password',
            label: 'Password: ',
            name: 'password',
            fieldProps: {
                rules: [{ required: true }]
            }
        },
        index === 1 ? {
            type: 'password',
            label: 'Confirm: ',
            name: 'confirm',
            fieldProps: {
                rules: [{ required: true }]
            }
        } : null
    ]

    return (
        <div style={{ position: 'absolute', top: '50%', width: '100%', transform: 'translate(0,-50%)' }}>
            <SegmentedControl
                style={{ marginBottom: '0.5rem' }}
                values={['login', 'signup']}
                selectedIndex={index}
                onChange={e => setIndex(e.nativeEvent.selectedSegmentIndex)}
            />
            <FormItems
                init={form => formRef.current = form}
                items={items.filter(Boolean)}
            />
            < Button type='primary' onClick={index === 0 ? submit : submit2} > {index === 0 ? 'Login' : 'Signup'} </Button>
        </div >
    )
}