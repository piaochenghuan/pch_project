
interface Options {
    method: string,
    [others: string]: any
}
const host = 'http://127.0.0.1:3000'

export default (url: string = '/', options: Options) => {
    const obj = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        }
    }
    return fetch(host + url, { ...obj, ...options })
        .then(res => res.json())
        .then(res => res)
        .catch(err => { console.log(err); })
}