import React from 'react'
import style from './index.less'

export default (props: any) => {
    return (
        <div className={style.layout}>
            {props.children}
        </div>
    )
}