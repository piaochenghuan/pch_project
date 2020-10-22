import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Checkbox, List } from 'antd'
import request from '@/utils/request';
import style from './index.less'



export default () => {
    const userId = localStorage.getItem('userId')
    const [list, setList] = useState([])

    useEffect(() => {
        onSearch()
    }, [])

    // 查询列表
    function onSearch(keyword: string = '') {
        request({
            url: '/note/queryMyOwn',
            method: 'GET',
            params: { keyword }
        }).then(res => {
            if (res && res.success) {
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
                    <List.Item actions={
                        [<a onClick={() => {
                            request({
                                url: '/note/delete',
                                method: 'POST',
                                data: { noteId: item.noteId }
                            }).then(res => {
                                if (res.success) {
                                    onSearch()
                                }
                            })
                        }}>删除</a>]}>
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