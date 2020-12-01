

import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, useLocation } from 'umi';
import { List, WhiteSpace, Tabs, Badge, SearchBar, Button, TextareaItem, Card } from 'antd-mobile'
import { Context } from '@/layouts'
import { createForm } from 'rc-form'
import PicView from '@/components/PicView'
import FormItems from '@/components/FormItems'
import { message } from 'antd'
import request from '@/utils/request'


export default (props) => {
    const { width, userInfo, host } = useContext(Context)
    const [list, setList] = useState([])


    useEffect(() => {
        fetchList()
    }, [])


    function fetchList() {
        request({
            url: 'queryRemindedEvent',
        }).then(res => {
            if (res && res.success) {
                setList(res.data)
            }
        })
    }

    return (
        <div>
            <List renderHeader='Reminded List'>
                {list.map(item => {
                    const { eventId, name, location, initiatorName, initiatorAvatar, createTime, content } = item
                    return <List.Item
                        wrap
                        onClick={() => {
                            history.push({
                                pathname: '/event',
                                query: {
                                    keyword: eventId
                                }
                            })
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <img className='avatar' style={{ marginRight: '1rem' }} src={host + initiatorAvatar} />
                            <div style={{ flex: '1' }}>
                                <div>{initiatorName}, 邀请你参加 <span style={{ fontWeight: 'bolder' }}>{name}</span></div>
                                <div>{createTime}</div>
                            </div>
                            <a>Go></a>
                        </div>
                    </List.Item>
                })}
            </List>
        </div>
    )
}