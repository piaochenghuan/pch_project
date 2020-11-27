import React, { useEffect, createContext } from 'react'
import styles from './index.less'
import Header from './Header'
import Footer from './Footer'
// import ChatingBox from './components/ChatingBox'
import { useViewport, useUserInfo } from '@/utils/hooks'
import host from '@/utils/ENV_CONFIG'
import io from 'socket.io-client'

// 创建上下文
export const Context = createContext({ width: window.innerWidth, userInfo: {}, host: '' })

export default (props) => {
    const { children, location: { pathname }, history } = props
    //  窗口宽度
    const { width } = useViewport()
    // 用户信息
    const [userInfo, setLocalStorage] = useUserInfo()



    // 如果是登录页 单独渲染登录页
    let childrenNode = pathname !== '/login' ? (
        <>
            <div className={styles.header}><Header {...props} /></div>
            <div className={styles.body}>{children}</div>
            <div className={styles.footer}><Footer {...props} /></div>
            {/* <ChatingBox /> */}
        </>
    ) : children
    // 判断是否登录
    if (JSON.stringify(userInfo) === '{}' && pathname !== '/login') {
        childrenNode = null
        history.push('/login')
    }



    const wsHost = host.replace('http', 'ws')
    const socket = io(wsHost, {
        autoConnect: false,
        query: {
            userId: userInfo.userId,
            username: userInfo.username,
        }
    });



    useEffect(() => {
        // 查询用户基础数据
    }, [])



    return (
        <Context.Provider value={{
            width,
            userInfo: userInfo || {},
            setLocalStorage,
            host,
            socket
        }}>
            <div className={styles.layout}>
                {childrenNode}
            </div>
        </Context.Provider >
    )
}