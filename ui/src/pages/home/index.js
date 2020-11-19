import React, { useEffect, useState, useContext } from 'react'
import { Input, List, Space, Image } from 'antd'
import { SearchBar, Card, WingBlank, WhiteSpace, InputItem, Button } from 'antd-mobile'
import { MessageOutlined, } from '@ant-design/icons';
import request from '@/utils/request';
import { Context } from '@/layouts'

export default (props) => {
    const { width, userInfo, host } = useContext(Context)
    const [list, setList] = useState([])
    const [replyList, setReplyList] = useState([])
    const [show, setShow] = useState(false)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [currentNoteId, setCurrentNoteId] = useState('')

    useEffect(() => {
        fetchList()
    }, [])

    // 查询note列表
    function fetchList(obj = {}, action) {
        const params = obj
        request({
            url: 'noteQuery',
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
            url: 'noteQueryReplyByNoteId',
            params: { noteId }
        }).then((res) => {
            if (res && res.success) {
                setReplyList(res.data)
            }
        })
    }
    // 点击回复图标
    function clickReply(noteId) {
        if (noteId !== currentNoteId) {
            fetchReplyList(noteId)
        } else {

        }
        setShow(true)
        setCurrentNoteId(noteId)
    }
    // 提交评论
    function submitReply(noteId, content, replyId) {
        if (content.trim()) {
            return request({
                url: 'noteReply',
                method: 'post',
                data: {
                    noteId,
                    content,
                    replyId
                }

            }).then((res) => {
                if (res && res.success) {
                    fetchReplyList(noteId)
                    return true
                }
            })
        }
    }
    return (
        <div style={{ position: 'relative', height: '100%' }} onClick={() => show && setShow(false)}>
            <SearchBar placeholder='search...' onSubmit={(val) => fetchList({ keyword: val })} />
            <div>
                {list.map((item) => {
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
                                        {item.images && item.images.split(',').map((i) => {
                                            return <img style={{ width: '10rem' }} src={host + i} />
                                        })}
                                    </div>
                                </Card.Body>
                                <Card.Footer content={
                                    <div >
                                        <span onClick={() => clickReply(item.noteId)}>评论 {item.replyCount}</span>
                                    </div>
                                } />
                            </Card>
                            <WhiteSpace />
                        </>
                    )
                })}
                {/* 加载更多 */}
                <div className='ac' onClick={() => {
                    if (pagination.total > list.length) {
                        fetchList({ page: page + 1 }, 'concat')
                        setPage(page + 1)
                    }
                }}>
                    {pagination.total > list.length ? '﹀' : 'no more'}
                </div>
            </div>

            <ReplyModal show={show} replyList={replyList} noteId={currentNoteId} submitReply={submitReply} />

        </div>
    )
}




// 回复列表
function ReplyModal(props) {
    const {
        show,
        replyList = [],
        noteId,
        submitReply = () => { }
    } = props
    const { width, userInfo, host } = useContext(Context)
    const [selected, setSelected] = useState()
    const [content, setContent] = useState('') // 评论内容

    // 每次点击不同评论时初始化数据
    useEffect(() => {
        setSelected(null)
        setContent('')
    }, [noteId])

    // 提交评论
    function send() {
        let replyId
        if (selected) {
            replyId = selected.replyId
        }
        submitReply(noteId, content, replyId).then((res) => {
            if (res) {
                setContent('')
                setSelected(null)
            }
        })
    }

    return (
        <div style={{
            transform: show ? 'translateX(0)' : 'translateX(100%)',
            transition: 'all 0.2s',
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            top: '0',
            zIndex: 10

        }}>
            <div style={{
                transform: show ? 'translateX(0)' : 'translateX(100%)',
                transition: 'all 0.2s',
                position: 'absolute',
                bottom: '0',
                backgroundColor: '#fff',
                width: '100%',
                height: '70%',
                display: 'flex',
                flexDirection: 'column'
            }}
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <div className='ac'><WhiteSpace />Reply<WhiteSpace /></div>
                <div style={{ flex: '1', overflowY: 'auto' }}>
                    {replyList.map((item) => {
                        return (
                            <WingBlank>
                                <div onClick={() => setSelected(item)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span><img src={host + item.userAvatar} style={{ width: '1.5rem', height: '1.5rem' }} /> {item.username}{item.toUsername && ` > ${item.toUsername}`}</span>
                                        <span>{item.createTime}</span>
                                    </div>
                                    <div style={{ padding: '0.5rem 1rem' }}>
                                        <span>{item.content}</span>
                                    </div>
                                </div>
                                <WhiteSpace />
                            </WingBlank>
                        )
                    })}
                </div>
                <div style={{ borderTop: '0.1rem solid rgb(200,200,200)' }} >
                    <InputItem
                        value={content}
                        placeholder={selected ? `@${selected.username}` : 'input your reply'}
                        onChange={val => setContent(val)}
                        extra={<a onClick={send}>Send</a>} />
                </div>
            </div>

        </div>
    )
}
