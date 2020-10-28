import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Checkbox, List, Pagination } from 'antd'
import request from '@/utils/request';
import style from './index.less'
import pic from '@/assets/pic.jpg'

export default (props: any) => {
    const { location: { query: { currentPage } } } = props
    const [list, setList] = useState([])
    const [pagination, setPagination]: any = useState({})

    useEffect(() => {
        onSearch()
    }, [])

    // 查询列表
    function onSearch(obj: any = {}) {
        const params = obj
        request({
            url: '/note/query',
            params
        }).then((res: any) => {
            if (res && res.success) {
                setList(res.data.list)
                setPagination({
                    page: res.data.page,
                    pageSize: res.data.pageSize,
                    total: res.data.total
                })
            }
        })
    }

    return (
        <div>
            <Input.Search onSearch={onSearch} style={{ width: 300 }} placeholder='search by title' />

            <List
                itemLayout="vertical"
                size="large"
                dataSource={list}

                renderItem={(item: any) => {
                    const title = `${item.title} 用户: ${item.username} ${item.createTime}`
                    return <List.Item>
                        <List.Item.Meta
                            avatar={<img src={item.userAvatar ? 'http://127.0.0.1:3000' + item.userAvatar : ''} style={{ width: 100 }} />}
                            title={title}
                            description={item.desc}
                        />
                        {item.content}
                    </List.Item>
                }}
                pagination={{
                    onChange: page => {
                        onSearch({ page })
                    },
                    pageSize: pagination.pageSize || 20,
                    total: pagination.total
                }}
            />
        </div>
    )
}