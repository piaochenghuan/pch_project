
import React, { useState } from 'react'
import { Form, Button, Input, Tabs, message, Space, Menu, Popconfirm } from 'antd'
import { history } from 'umi';
import request from '@/utils/request';
import { getUserInfo } from '@/utils/common'

export default () => {
    const { username } = getUserInfo()
    const arr: any = [
        { name: 'Home', onClick: () => history.push('/home') },
        { name: 'Create A Note', onClick: () => history.push('/note/add') },
        { name: 'My Notes', onClick: () => history.push('/note/mylist') },
    ]
    return (
        <div>
            <h1  >{username}, Welcome</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Menu mode="horizontal" defaultSelectedKeys={['0']}>
                    {arr.map((item: any, index: any) => {
                        return <Menu.Item key={String(index)} onClick={item.onClick}>{item.name}</Menu.Item>
                    })}
                </Menu>

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
    )
}