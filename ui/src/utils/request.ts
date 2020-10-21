
import qs from 'qs'



interface Options {
    url: string
    body?: any
    params?: any
    [others: string]: any
}
const host = 'http://127.0.0.1:3000'

export default (options: Options) => {
    const obj = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        ...options
    }
    if (obj.body) {
        obj.body = JSON.stringify(obj.body)
    }
    if (obj.params) {
        obj.url = obj.url + '?' + qs.stringify(obj.params)
    }
    return fetch(host + obj.url, obj)
        .then(res => res.json())
        .then(res => res)
        .catch(err => { console.log(err); })
}