

const host = 'http://127.0.0.1:3000'

export default (url: string = '/', options: object = {}) => {
    const obj = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    }
    fetch(host + url, options)
        .then(res => res.json())
        .then(res => res)
        .catch(err => { console.log(err); })
}