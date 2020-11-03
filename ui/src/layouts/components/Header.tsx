
import React, { useState } from 'react'
import { Form, Button, Input, Tabs, message, Space, Menu, Popconfirm } from 'antd'
import { history,useLocation } from 'umi';
import request from '@/utils/request';
import { getUserInfo } from '@/utils/common'

export default (props: any) => {
    const location = useLocation()
    const {pathname} = location
    const { username, userAvatar } = getUserInfo()
    const arr: any = [
        { name: 'Home', onClick: () => history.push('/home'), key: '/home' },
        { name: 'Create A Note', onClick: () => history.push('/note/add'), key: '/note/add' },
        { name: 'My Notes', onClick: () => history.push('/note/mylist'), key: '/mylist' },
    ]
    return (
        <div>
            <h1  >{username}, Welcome</h1>
            <div style={{ display: 'flex', alignItems: 'center' }} >
                <div style={{ flex: '1' }}>
                    <Menu mode="horizontal" selectedKeys={[pathname]}>
                        {arr.map((item: any, index: any) => {
                            return <Menu.Item key={item.key} onClick={item.onClick}>{item.name}</Menu.Item>
                        })}
                    </Menu>
                </div>

                <div>
                    <img src={'http://localhost:3000' + userAvatar} style={{ width: 30, height: 30 }} />
                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => {
                            history.push('/login')
                            localStorage.clear()
                        }}
                        okText="sure"
                        cancelText="cancel"
                    >
                        <Button>Log out</Button>
                    </Popconfirm>
                </div>

            </div>
        </div>
    )
}