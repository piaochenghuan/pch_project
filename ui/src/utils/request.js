
import { message } from 'antd'
import qs from 'qs'
import axios from 'axios'
import { history } from 'umi'
import host from '@/utils/ENV_CONFIG'
import api from '@/utils/api'


export default (options) => {
    const config = {
        method: 'get',
        headers: {
            'content-type': 'application/json',
        },
        ...options,
        url: host + api[options.url]
    }
    if (config.data && !options.upload) {
        config.data = JSON.stringify(config.data)
    }

    // 上传文件时 不能自定义headers里的  content-type
    if (config.upload) {
        config.headers = {}
    }

    // 携带token
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        config.headers['Authorization'] = JSON.parse(userInfo).token
    }

    return axios.request(config)
        .then(res => {
            if (res?.data?.success) {
                return res.data
            } else {
                if (typeof res.data.msg === 'string') {
                    message.error(res.data.msg)
                } else {
                    console.log(res.data.msg);
                    message.error('接口错误')
                }
                return {}
            }
        })
        .catch(err => {
            console.log(err)
            message.error(String(err))
        })
}