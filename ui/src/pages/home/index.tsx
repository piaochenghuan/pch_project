import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Checkbox, List, Pagination, Space } from 'antd'
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import style from './index.less'
import { getUserInfo } from '@/utils/common'

const { username } = getUserInfo()

export default (props: any) => {
    const { location: { query: { currentPage } } } = props
    const [list, setList] = useState([])
    const [replyList, setReplyList]: any = useState({})
    const [pagination, setPagination]: any = useState({})
    const [noteId, setNoteId]: any = useState({})
    const [replyContent, setReplyContent]: any = useState('')

    useEffect(() => {
        fetchList()
    }, [])

    // 查询note列表
    function fetchList(obj: any = {}) {
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
    // 查询回复列表
    function fetchReplyList(noteId: any) {
        request({
            url: '/note/queryReplyByNoteId',
            params: { noteId }
        }).then((res: any) => {
            if (res && res.success) {
                replyList[noteId] = res.data
                setReplyList({ ...replyList })
            }
        })
    }

    function clickReply(item: any) {
        if (item.noteId !== noteId[item.noteId]) {
            setNoteId[item.noteId] = item.noteId
            fetchReplyList(item.noteId)
        } else {
            delete setNoteId[item.noteId]
        }

        setNoteId({ ...setNoteId })

    }
    // 提交评论
    function submitReply(noteId: any) {
        if (replyContent.trim()) {
            request({
                url: '/note/reply',
                method: 'post',
                data: {
                    noteId: noteId,
                    content: replyContent
                }

            }).then((res: any) => {
                if (res && res.success) {
                    fetchList()
                    fetchReplyList(noteId)
                }
            })
        }
    }
    return (
        <div>
            <Input.Search onSearch={fetchList} style={{ width: 300 }} placeholder='search by title' />

            <List
                itemLayout="vertical"
                size="large"
                dataSource={list}

                renderItem={(item: any) => {
                    return (
                        <>
                            <List.Item
                                actions={[
                                    <Space>
                                        <MessageOutlined onClick={() => clickReply(item)} />156
                                            </Space>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<img src={item.userAvatar ? 'http://localhost:3000' + item.userAvatar : ''} style={{ width: 100, height: 100 }} />}
                                    title={item.title}
                                    description={`user : ${item.username} ${item.createTime}`}
                                />
                                {item.content}
                            </List.Item>

                            {noteId[item.noteId] === item.noteId && <div style={{ padding: '0 40px' }}>
                                <Input value={replyContent} onChange={e => setReplyContent(e.target.value)} addonBefore={username + ' : '} addonAfter={<a onClick={() => submitReply(item.noteId)}>评论</a>} />
                                <div>
                                    {replyList[item.noteId] && replyList[item.noteId].map((item: any) => {
                                        return <div>
                                            {item.username} : {item.content}
                                        </div>
                                    })}
                                </div>
                            </div>}

                        </>
                    )
                }}
                pagination={{
                    onChange: page => {
                        fetchList({ page })
                    },
                    pageSize: pagination.pageSize || 20,
                    total: pagination.total
                }}
            />
        </div>
    )
}