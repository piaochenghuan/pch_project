
import React, { useState, useContext, useEffect } from 'react'
import { history, useLocation } from 'umi';
import { Button, Drawer, List, NavBar, Icon } from 'antd-mobile'
import { Context } from '@/layouts'

export default (props) => {
    const { location: { pathname, query } } = props
    const { width, userInfo, host } = useContext(Context)
    const { username, userAvatar } = userInfo
    const [open, setOpen] = useState(false)
    const arr = [
        // { name: 'My Notes', onClick: () => history.push('/note/mylist'), key: '/mylist' },
    ]

    useEffect(() => {
        setOpen(false)
    }, [query])

    function showSideBar() {
        setOpen(!open)
    }

    const menuList = (
        <List
            renderHeader={<div className='ac'><img src={host + userAvatar} style={{ width: '2rem', height: '2rem' }} /></div>}
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
                leftContent={<Icon type='ellipsis' />}
                onLeftClick={showSideBar}
                rightContent={<span onClick={() => {
                    history.push('/note/add')
                }}>Note</span>}
            >
                {username}
            </NavBar>
            <Drawer
                className="my-drawer"
                style={{ top: '3rem' }}
                sidebar={menuList}
                sidebarStyle={{ backgroundColor: '#fff' }}
                open={open}
                onOpenChange={showSideBar}
            />
        </div>
    )
}