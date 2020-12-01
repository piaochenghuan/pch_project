
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, location } from 'umi';
import { TabBar, Badge } from 'antd-mobile'
import { Context } from '@/layouts'
import request from '@/utils/request';

export default (props) => {
    const { location: { pathname } } = props
    const { userMsgCount } = useContext(Context)

    const arr = [
        { title: 'Home', onClick: () => history.push('/home'), key: '/home', icon: <i className='iconfont icon-home'></i> },
        { title: 'Event', onClick: () => history.push('/event'), key: '/event', icon: <i className='iconfont icon-hot'></i> },
        { title: 'Message', onClick: () => history.push('/user/message'), key: '/user/message', icon: <i className='iconfont icon-comment'></i>, count: userMsgCount.userRemindCount, },
        { title: 'My', onClick: () => history.push('/user/my'), key: '/user/my', icon: <i className='iconfont icon-user'></i> },
    ]

    return (
        <div>
            <TabBar unselectedTintColor='#888' tintColor='#108ee9'>
                {arr.map(item => {
                    const { title, key, onClick, icon, count } = item
                    let text = null
                    if (count) {
                        text = count.toString()
                    }
                    return <TabBar.Item
                        key={key}
                        title={title}
                        onPress={onClick}
                        selected={pathname === key}
                        icon={<Badge text={count}>{icon}</Badge>}
                        selectedIcon={<Badge text={count}>{icon}</Badge>}
                    />
                })}
            </TabBar>
        </div>
    )
}
