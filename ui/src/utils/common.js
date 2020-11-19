// 获取用户信息
export function getUserInfo() {
    if (localStorage.getItem('userInfo')) {
        return JSON.parse(localStorage.getItem('userInfo'))
    }
}