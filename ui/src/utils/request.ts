
import { message } from 'antd'
import qs from 'qs'
import axios from 'axios'
import { history } from 'umi'

interface Options {
    url: string
    data?: any
    params?: any
    [others: string]: any
}
const host = 'http://localhost:3000'

export default (options: Options) => {
    const obj: any = {
        method: 'get',
        headers: {
            'content-type': 'application/json',
        },
        data: {},
        params: {},
        ...options,
        url: host + options.url
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
                message.error(res.data.msg)
            }
        })
        .catch(err => {
            console.log(err)
            message.error('')
        })
}