import React, { useEffect, useState, useContext } from 'react'
import { Input, List, Space, Image } from 'antd'
import { SearchBar, Card, WingBlank, WhiteSpace, InputItem, Button } from 'antd-mobile'
import { MessageOutlined, } from '@ant-design/icons';
import request from '@/utils/request';
import { Context } from '@/layouts'
import host from '@/utils/ENV_CONFIG'


export default (props) => {
    const { width, userInfo: { username } } = useContext(Context)
    const [list, setList] = useState([])
    const [replyList, setReplyList] = useState({})
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [noteIds, setNoteIds] = useState({})
    const [input, setInput] = useState('') // 回复内容

    useEffect(() => {
        fetchList()
    }, [])

    // 查询note列表
    function fetchList(obj = {}, action) {
        const params = obj
        request({
            url: '/note/query',
            params
        }).then((res) => {
            if (res && res.success) {

                action === 'concat' ? setList(list.concat(res.data.list)) : setList(res.data.list)
                setPagination({
                    page: res.data.page,
                    pageSize: res.data.pageSize,
                    total: res.data.total
                })
            }
        })
    }
    // 查询回复列表
    function fetchReplyList(noteId) {
        request({
            url: '/note/queryReplyByNoteId',
            params: { noteId }
        }).then((res) => {
            if (res && res.success) {
                replyList[noteId] = res.data
                setReplyList({ ...replyList })
            }
        })
    }
    // 点击回复图标
    function clickReply(item) {
        if (item.noteId !== noteIds[item.noteId]) {
            noteIds[item.noteId] = item.noteId
            fetchReplyList(item.noteId)
        } else {
            delete noteIds[item.noteId]
        }
        setNoteIds({ ...noteIds })
    }
    // 提交评论
    function submitReply(noteId) {
        if (input.trim()) {
            request({
                url: '/note/reply',
                method: 'post',
                data: {
                    noteId: noteId,
                    content: input
                }

            }).then((res) => {
                if (res && res.success) {
                    fetchReplyList(noteId)
                    setInput('')
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



            <div>
                {list.map(item => {
                    return (
                        <>
                            <Card>
                                <Card.Header
                                    title={item.title}
                                    thumb={item.userAvatar ? host + item.userAvatar : ''}
                                    thumbStyle={{ width: '2rem', height: '2rem' }}
                                />
                                <Card.Body>
                                    <div >
                                        {item.content}
                                    </div>
                                    <div>
                                        {item.images && item.images.split(',').map(i => {
                                            return <img width={150} src={host + i} />
                                        })}
                                    </div>
                                </Card.Body>
                                <Card.Footer content={<>
                                    <span onClick={() => clickReply(item)} >Reply</span> {item.replyCount}
                                    {noteIds[item.noteId] === item.noteId &&
                                        <div >
                                            <div style={{ textAlign: 'center' }}>↓</div>
                                            <InputItem
                                                value={input}
                                                onChange={val => setInput(val)}
                                                placeholder='input your message...'
                                                extra={<a onClick={() => submitReply(item.noteId)}>Send</a>}
                                            >

                                            </InputItem>
                                            <div>
                                                {replyList[item.noteId] && replyList[item.noteId].map((item) => {
                                                    return <WingBlank><div>{item.username} : {item.content}</div></WingBlank>
                                                })}
                                            </div>
                                        </div>}
                                </>} />
                            </Card>
                            <WhiteSpace />
                        </>
                    )
                })}
                {/* 加载更多 */}
                {pagination.total > list.length ? <Button onClick={() => {
                    fetchList({ page: page + 1 }, 'concat')
                    setPage(page + 1)
                }}>More</Button> :
                    <Button>No more</Button>
                }
            </div>
        </div>
    )
}