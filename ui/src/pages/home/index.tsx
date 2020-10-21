import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Checkbox, List } from 'antd'
import request from '@/utils/request';
import style from './index.less'

export default function Home() {
    const [list, setList] = useState([])

    useEffect(() => {
        request({
            url: '/note/query',
            method: 'GET'
        }).then(res => {
            if (res.success) {
                setList(res.data)
            }
        })
    }, [])

    // 查询列表
    function onSearch(keyword: string) {
        request({
            url: '/note/query',
            method: 'GET',
            params: { keyword }
        }).then(res => {
            if (res.success) {
                setList(res.data)
            }
        })
    }

    return (
        <div>
            <Input.Search onSearch={onSearch} style={{ width: 300 }} placeholder='search by title' />

            <List
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item: any) => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.title}
                            description={item.content}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}