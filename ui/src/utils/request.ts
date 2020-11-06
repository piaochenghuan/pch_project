
import { message } from 'antd'
import qs from 'qs'
import axios from 'axios'
import { history } from 'umi'
import host from '@/utils/ENV_CONFIG'
import api from '@/utils/api'

interface Options {
    url: string
    data?: any
    params?: any
    [others: string]: any
}

export default (options: Options) => {
    const obj: any = {
        method: 'get',
        headers: {
            'content-type': 'application/json',
        },
        data: {},
        params: {},
        ...options,
        url: host + api[options.url]
    }
    if (obj.data && !options.upload) {
        obj.data = JSON.stringify(obj.data)
    }

    // 上传文件时 不能自定义headers里的  content-type
    if (obj.upload) {
        obj.headers = {}
    }

    // 携带token
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        obj.headers['Authorization'] = JSON.parse(userInfo).token
    }

    return axios.request(obj)
        .then((res: any) => {
            if (res?.data?.success) {
                return res.data
            } else {
                if (typeof res.data.msg === 'string') {
                    message.error(res.data.msg)
                } else {
                    console.log(res.data.msg);
                    message.error('接口错误')
                }
            }
        })
        .catch(err => {
            console.log(err)
            message.error(String(err))
        })
}