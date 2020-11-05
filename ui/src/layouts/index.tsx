import React, { useEffect, createContext } from 'react'
import styles from './index.less'
import Header from './components/Header'
import ChatingBox from './components/ChatingBox'
import { getUserInfo } from '@/utils/common'
import { useViewport } from '@/utils/hooks'


export const Context = createContext({ width: window.innerWidth, userInfo: {} })

export default (props: any) => {
    //  窗口宽度
    const { width } = useViewport()
    // 用户信息
    const userInfo = getUserInfo()

    return (
        <Context.Provider value={{ width, userInfo }}>
            { props.location.pathname === '/login'
                ?
                <div style={{ height: '100%' }}>{props.children}</div>
                :
                <div className={styles.layout}>
                    <div className={styles.header}><Header /></div>
                    <div className={styles.body}>{props.children}</div>
                    {/* <ChatingBox /> */}
                </div>}
        </Context.Provider>
    )
}