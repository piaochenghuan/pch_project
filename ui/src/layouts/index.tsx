import React, { useEffect, createContext } from 'react'
import styles from './index.less'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatingBox from './components/ChatingBox'
import { getUserInfo } from '@/utils/common'
import { useViewport } from '@/utils/hooks'

let userInfo = getUserInfo()

export const Context = createContext({ width: window.innerWidth, userInfo: {} })

export default (props: any) => {
    //  窗口宽度
    const { width } = useViewport()
    // 获取用户信息
    if (Object.keys(userInfo).length === 0) {
        userInfo = getUserInfo()
    }

    return (
        <Context.Provider value={{ width, userInfo }}>
            { props.location.pathname === '/login'
                ?
                <div>{props.children}</div>
                :
                <div className={styles.layout}>
                    <div className={styles.header}><Header /></div>
                    <div className={styles.body}>{props.children}</div>
                    <div className={styles.footer}><Footer /></div>
                    {/* <ChatingBox /> */}
                </div>}
        </Context.Provider>
    )
}