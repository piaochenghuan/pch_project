import React, { useEffect, createContext, useState, useRef } from 'react'
import styles from './index.less'
import Header from './Header'
import Footer from './Footer'
// import ChatingBox from './components/ChatingBox'
import { useViewport, useUserInfo } from '@/utils/hooks'
import host from '@/utils/ENV_CONFIG'
import io from 'socket.io-client'
import request from '@/utils/request';

// 创建上下文
export const Context = createContext({ width: window.innerWidth, userInfo: {}, host: '' })

export default (props) => {
    const { children, location: { pathname }, history } = props
    //  窗口宽度
    const { width } = useViewport()
    // localstorage的用户信息
    const [userInfo, setLocalStorage] = useUserInfo()
    // 用户推送消息数量
    const [userMsgCount, setUserMsgCount] = useState({})
    // socket
    const socketRef = useRef()

    useEffect(() => {
        if (pathname === '/login') {
            socketRef.current?.close() //关闭socket连接
        }
    }, [pathname])



    useEffect(() => {
        if (userInfo.userId) {
            // 查询用户信息
            fetchUser()
            // 关闭之前的连接
            socketRef.current?.close() 
            // socket预连接
            socketRef.current = io(host.replace('http', 'ws'), {
                autoConnect: false,
                query: {
                    userId: userInfo.userId,
                    username: userInfo.username,
                }
            });
            // 连接socket
            socketRef.current.open()
            socketRef.current.on('remindPush', function (data) {
                fetchUser()
            })
        }
    }, [userInfo])

    // 查询用户信息
    function fetchUser() {
        request({
            url: 'queryUser',
            params: { keyword: userInfo.userId }
        }).then(res => {
            if (res && res.success) {
                setUserMsgCount({
                    userRemindCount: res.data[0].userRemindCount, // 活动邀请 数量
                    userChatCount: res.data[0].userChatCount,  // 私信数量
                })
            }
        })
    }

    // 如果是登录页 单独渲染登录页
    let childrenNode = pathname !== '/login' ? (
        <>
            <div className={styles.header}><Header {...props} /></div>
            <div className={styles.body}>{children}</div>
            <div className={styles.footer}><Footer {...props} /></div>
            {/* <ChatingBox /> */}
        </>
    ) : children

    // 判断是否登录 未登录就跳转到登录页
    if (JSON.stringify(userInfo) === '{}' && pathname !== '/login') {
        childrenNode = null
        history.push('/login')
    }

    return (
        <Context.Provider value={{
            width,
            userInfo: userInfo || {},
            setLocalStorage,
            host,
            userMsgCount
        }}>
            <div className={styles.layout}>
                {childrenNode}
            </div>
        </Context.Provider >
    )
}