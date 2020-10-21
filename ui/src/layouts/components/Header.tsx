
import React from 'react'
import { Form, Button, Input, Tabs, message } from 'antd'
import { history } from 'umi';
import request from '@/utils/request';

export default () => {
    return (
        <div>
            <h1>{localStorage.getItem('username')},Welcome</h1>
            <div style={{ textAlign: 'right' }}>
                <Button type='primary' onClick={() => {
                    history.push('/note/add')
                }}>Leave Your Message</Button>
                <Button onClick={() => {
                    history.push('/login')
                    localStorage.clear()
                }}>Log Out</Button>
            </div>
        </div>
    )
}