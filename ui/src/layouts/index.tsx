import React, { useEffect } from 'react'
import style from './index.less'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatingBox from './components/ChatingBox'
import { getUserInfo } from '@/utils/common'
import { history } from 'umi';

export default (props: any) => {

    useEffect(() => {
        if (props.location.pathname !== '/login' && Object.keys(getUserInfo()).length === 0) {
            history.push('/login')
            console.log(666666);
        }
    }, [props.location.pathname])

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