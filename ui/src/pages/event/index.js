import React, { useEffect, useState, useContext } from 'react'
import { SearchBar, Card, WingBlank, WhiteSpace, InputItem, Button } from 'antd-mobile'
import { history, useLocation } from 'umi';
import request from '@/utils/request';
import { Context } from '@/layouts'
import PicView from '@/components/PicView'
import moment from "moment"


export default (props) => {
    const { location: { query: { keyword } } } = props
    const { width, userInfo, host } = useContext(Context)
    const [list, setList] = useState([])
    const [joinMap, setJoinMap] = useState({})
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [src, setSrc] = useState()


    useEffect(() => {
        if (keyword) {
            fetchList({ keyword })
        } else {
            fetchList()
        }
    }, [])

    // 查询note列表
    function fetchList(obj = {}, action) {
        request({
            url: 'eventQuery',
            params: obj
        }).then((res) => {
            if (res && res.success) {
                action === 'concat' ? setList(list.concat(res.data.list)) : setList(res.data.list)
                setPagination({
                    page: res.data.page,
                    pageSize: res.data.pageSize,
                    total: res.data.total
                })
                queryJoinList(res.data.list)
            }
        })
    }

    // 查询参加人员
    function queryJoinList(list) {
        list.forEach(item => {
            request({
                url: 'eventQueryJoinList',
                params: { eventId: item.eventId }
            }).then((res) => {
                if (res && res.success) {
                    joinMap[item.eventId] = res.data
                    setJoinMap({ ...joinMap })
                }
            })
        })
    }
    // 参加/取消 活动
    function join(eventId, join) {
        request({
            url: 'eventJoin',
            data: {
                eventId,
                join
            },
            method: 'post'
        }).then((res) => {
            if (res && res.success) {
                queryJoinList([{ eventId }])
            }
        })
    }

    return (
        <div style={{ height: '100%' }}>
            <SearchBar placeholder='search...' onSubmit={(val) => fetchList({ keyword: val })} />
            <div>
                {list.map((item) => {
                    const { initiatorName, initiatorAvatar, name, location, eventTime, images, eventId, content } = item
                    const joined = joinMap[eventId] && joinMap[eventId].some(i => i.userId === userInfo.userId) // 是否已经参加
                    const expired = moment(eventTime).isBefore() // 是否过期
                    const joinList = joinMap[eventId]
                    return (
                        <>
                            <Card >
                                <Card.Header
                                    title={initiatorName}
                                    thumb={initiatorAvatar ? host + initiatorAvatar : ''}
                                    thumbStyle={{ width: '2rem', height: '2rem' }}
                                />
                                <Card.Body>
                                    <div><a style={{ fontSize: '1.5rem' }}> {name}</a></div>
                                    <div><a><i className='iconfont icon-map'></i> {location}</a></div>
                                    <div><a style={{ color: expired ? 'red' : '#1890ff' }}><i className='iconfont icon-time'></i> {eventTime}</a></div>
                                    <div >
                                        {content.split('\n').map(i => <div>{i}</div>)}
                                    </div>
                                    <div>
                                        {images && images.split(',').map((i) => {
                                            return <img style={{ width: '10rem' }} src={host + i} onClick={() => {
                                                history.push({ query: { showPic: true } })
                                                setSrc(host + i)
                                            }} />
                                        })}
                                    </div>
                                </Card.Body>
                                <Card.Footer
                                    extra={!expired && joinList && <a style={{ color: joined ? 'red' : 'blue' }} onClick={() => join(eventId, joined ? '0' : '1')}>{joined ? 'Sorry' : 'Join'}</a>}
                                    content={
                                        <div >
                                            {joinList && joinList.map((item, index) => {
                                                return <div>{index + 1}, {item.username}</div>
                                            })}
                                        </div>
                                    } />
                            </Card>
                            <WhiteSpace />
                        </>
                    )
                })}
                {/* 加载更多 */}
                <div className='tac' onClick={() => {
                    if (pagination.total > list.length) {
                        fetchList({ page: page + 1 }, 'concat')
                        setPage(page + 1)
                    }
                }}>
                    {pagination.total > list.length ? '﹀' : 'no more'}
                </div>
            </div>

        </div>
    )

}