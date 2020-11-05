
import React, { useState, useContext, useEffect } from 'react'
import { history, useLocation } from 'umi';
import { Button, Drawer, List, NavBar, Icon } from 'antd-mobile'
import { Context } from '@/layouts'
import styles from '../index.less'

export default (props) => {
    const { width, userInfo } = useContext(Context)
    const location = useLocation()
    const { pathname, query } = location
    const { username, userAvatar } = userInfo
    const [open, setOpen] = useState(false)
    const arr = [
        { name: 'Home', onClick: () => history.push('/home'), key: '/home' },
        { name: 'My Notes', onClick: () => history.push('/note/mylist'), key: '/mylist' },
    ]

    useEffect(() => {
        setOpen(false)
    }, [query])


    function showSideBar(show) {
        setOpen(!open)
    }

    const menuList = (
        <List
            renderHeader={<img src={'http://localhost:3000' + userAvatar}
                style={{ width: '2rem', height: '2rem' }} />}
        >
            {arr.map(item => {
                return <List.Item platform='android' onClick={item.onClick}>{item.name}</List.Item>
            })}
            <List.Item platform='android'><Button type='warning' onClick={() => {
                history.push('/login')
                localStorage.clear()
            }}>Log out</Button></List.Item>
        </List>
    )
    return (
        <div>
            <NavBar
                mode='light'
                leftContent={<Icon type='ellipsis' onClick={showSideBar} />}
                rightContent={<span onClick={() => {
                    history.push('/note/add')
                }}>Note</span>}
            >

                {username}
            </NavBar>
            <Drawer
                className="my-drawer"
                // style={{ minHeight: document.documentElement.clientHeight }}
                style={{ top: '3rem' }}
                // enableDragHandle
                sidebar={menuList}
                sidebarStyle={{ backgroundColor: '#fff' }}
                open={open}
                onOpenChange={showSideBar}
            />
        </div>
    )
}