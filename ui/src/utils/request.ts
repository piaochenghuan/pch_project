
interface Options {
    url: string
    body?: any
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
    return fetch(host + obj.url, obj)
        .then(res => res.json())
        .then(res => res)
        .catch(err => { console.log(err); })
}