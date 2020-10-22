
import React from 'react'
import { Form, Button, Input, Tabs, message, Space, Menu } from 'antd'
import { history } from 'umi';
import request from '@/utils/request';
import { getUserInfo } from '@/utils/common'

export default () => {
    const { username } = getUserInfo()
    const arr: any = [
        { name: 'Home', onClick: () => history.push('/home') },
        { name: 'Create A Note', onClick: () => history.push('/note/add') },
        { name: 'My Notes', onClick: () => history.push('/note/mylist') },
        {
            name: 'Log Out', onClick: () => {
                history.push('/login')
                localStorage.clear()
            }
        },
    ]
    return (
        <div>
            <h1  >{username}, Welcome</h1>
            <div >
                <Menu mode="horizontal" style={{ textAlign: 'right' }}>
                    {arr.map((item: any) => {
                        return <Menu.Item onClick={item.onClick}>{item.name}</Menu.Item>
                    })}
                </Menu>
            </div>
        </div>
    )
}