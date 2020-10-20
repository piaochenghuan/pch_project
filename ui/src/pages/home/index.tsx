import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Checkbox } from 'antd'
import request from '@/utils/request';
import style from './index.less'

export default function Home() {

    useEffect(() => {
        request({
            url: '/note/query',
            method: 'GET'
        }).then(res => {
            if (res.success) {
                debugger
            }
        })
    }, [])

    return (
        <div>
            home
        </div>
    )
}