import React, { useEffect } from 'react'
import style from './index.less'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatingBox from './components/ChatingBox'
import { getUserInfo } from '@/utils/common'
import { history } from 'umi';
import { message } from 'antd'

export default (props: any) => {


    if (props.location.pathname !== '/login' && Object.keys(getUserInfo()).length === 0) {
        history.push('/login')
    }

    return (
        props.location.pathname === '/login'
            ?
            <div>{props.children}</div>
            :
            <div className={style.layout}>
                <div className={style.header}><Header /></div>
                <div className={style.body}>{props.children}</div>
                <div className={style.footer}><Footer /></div>
                {/* <ChatingBox /> */}
            </div>
    )
}