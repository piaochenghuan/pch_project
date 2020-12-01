
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, useLocation } from 'umi';
import { List, WhiteSpace, Tabs, Badge, SearchBar, Button, TextareaItem, Card } from 'antd-mobile'
import { Context } from '@/layouts'
import { createForm } from 'rc-form'
import PicView from '@/components/PicView'
import FormItems from '@/components/FormItems'
import { message } from 'antd'
import request from '@/utils/request'
import EventRermind from './components/EventRemind'


export default (props) => {
    const { location: { query: { action } } } = props
    const { userInfo, host, userMsgCount } = useContext(Context)

    function changeAction(name) {
        history.push({
            query: { action: name }
        })
    }

    const arr = [
        { title: '活动邀请', count: userMsgCount.userRemindCount, onClick: () => changeAction('eventRemind') },
        { title: '私信', count: userMsgCount.userChatCount, onClick: () => changeAction('privateMsg') },
        { title: '活动消息', onClick: () => changeAction('eventMsg') },
    ]

    return (
        <div>
            {!action &&
                <List>
                    {arr.map(item => {
                        const { title, count, onClick } = item
                        let text = null
                        if (count) {
                            text = count.toString()
                        }
                        return (
                            <List.Item
                                onClick={onClick}
                                extra={<Badge text={text}>></Badge>}
                            >
                                {title}
                            </List.Item>
                        )
                    })}
                </List>}

            {action === 'eventRemind' && <EventRermind />}



        </div>
    )
}