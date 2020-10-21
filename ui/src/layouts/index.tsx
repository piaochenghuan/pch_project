import React from 'react'
import style from './index.less'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatingBox from './components/ChatingBox'

export default (props: any) => {

    return (
        props.location.pathname === '/login'
            ?
            <div>{props.children}</div>
            :
            <div className={style.layout}>
                <div className={style.header}><Header /></div>
                <div className={style.body}>{props.children}</div>
                <div className={style.footer}><Footer /></div>
                <ChatingBox />
            </div>
    )
}