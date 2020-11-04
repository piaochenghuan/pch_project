
import React, { useState, useContext } from 'react'
import { history, useLocation } from 'umi';
import { Button, Drawer, List, NavBar, Icon } from 'antd-mobile'
import { Context } from '@/layouts'
import styles from '../index.less'

export default (props: any) => {
    const { width, userInfo } = useContext(Context)
    const location = useLocation()
    const { pathname } = location
    const { username, userAvatar } = userInfo
    const [open, setOpen] = useState(false)
    const arr: any = [
        { name: 'Home', onClick: () => history.push('/home'), key: '/home' },
        { name: 'Create A Note', onClick: () => history.push('/note/add'), key: '/note/add' },
        { name: 'My Notes', onClick: () => history.push('/note/mylist'), key: '/mylist' },
    ]

    console.log(open);
    return (
        <div>
            {/* < div>{username}, Welcome</div> */}
            <NavBar
                mode='light'
                leftContent={<Icon type='ellipsis' onClick={() => setOpen(!open)} />}
                // onLeftClick={}
                rightContent={<span onClick={() => {
                    history.push('/note/add')
                }}>new</span>}
            >
                <img src={'http://localhost:3000' + userAvatar} style={{ width: '2rem', height: '2rem' }} />
                {username}
            </NavBar>
            <Drawer
                className='my-drawer'
                overlayStyle={{height:'12rem',top:'12rem'}}
                // style={{ minHeight: document.documentElement.clientHeight-300 }}
                open={true}
                sidebar={<a>哈哈哈哈</a>}
            />
        </div>
    )
}