import React, { useEffect, useState, useContext } from 'react'
import { Input, List, Space, Image } from 'antd'
import { SearchBar } from 'antd-mobile'
import { MessageOutlined, } from '@ant-design/icons';
import request from '@/utils/request';
import { Context } from '@/layouts'


export default (props: any) => {
    const { width } = useContext(Context)
    const { location: { query: { currentPage } } } = props
    const [list, setList] = useState([])
    const [replyList, setReplyList]: any = useState({})
    const [pagination, setPagination]: any = useState({})
    const [noteIds, setNoteIds]: any = useState({})
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
    // 点击回复图标
    function clickReply(item: any) {
        if (item.noteId !== noteIds[item.noteId]) {
            setNoteIds[item.noteId] = item.noteId
            fetchReplyList(item.noteId)
        } else {
            delete setNoteIds[item.noteId]
        }
        setNoteIds({ ...setNoteIds })
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
                    setReplyContent('')
                }
            })
        }
    }
    return (
        <div>

            {/* <Input.Search onSearch={fetchList} style={{ width: '50%' }} placeholder='search by title' /> */}
            <SearchBar
                placeholder='search...'
                onSubmit={(val) => fetchList({ keyword: val })}
            />
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
                                        <MessageOutlined onClick={() => clickReply(item)} />{item.replyCount}
                                    </Space>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<img src={item.userAvatar ? 'http://localhost:3000' + item.userAvatar : ''} style={{ width: 50, height: 50 }} />}
                                    title={item.title}
                                    description={`user : ${item.username} ${item.createTime}`}
                                />
                                <div >
                                    {item.content}
                                </div>
                                <div>
                                    {item.images && item.images.split(',').map((i: any) => {
                                        return <Image
                                            width={300}
                                            src={'http://localhost:3000' + i}
                                        />
                                    })}
                                </div>

                            </List.Item>


                            {/* 评论列表 */}
                            {noteIds[item.noteId] === item.noteId && <div style={{ padding: '10px 40px' }}>
                                <Input style={{ width: '300px', marginBottom: '10px' }} value={replyContent} onChange={e => setReplyContent(e.target.value)} addonAfter={<a onClick={() => submitReply(item.noteId)}>评论</a>} />
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