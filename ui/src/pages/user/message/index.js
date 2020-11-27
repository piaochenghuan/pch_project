
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, useLocation } from 'umi';
import { List, WhiteSpace, Tabs, Badge, SearchBar, Button, TextareaItem } from 'antd-mobile'
import { Context } from '@/layouts'
import { createForm } from 'rc-form'
import PicView from '@/components/PicView'
import FormItems from '@/components/FormItems'
import { message } from 'antd'
import request from '@/utils/request'
import io from 'socket.io-client'


export default () => {
    const { userInfo, host, socket } = useContext(Context)
    const socketRef = useRef()

    useEffect(() => {

        // socket.open()
    }, [])

    function sendMsg() {
        // socket.emit('sayTo', {
        //     toUsername: 'pch',
        //     content: 'hi ,pch'
        // })
    }
    return (
        <div>
            <div style={{ backgroundColor: 'pink', height: '20rem' }}>

            </div>
            <TextareaItem rows={5} />
            <Button type='primary' onClick={sendMsg}>Send</Button>
        </div>
    )
}