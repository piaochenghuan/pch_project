
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, location } from 'umi';
import { TabBar, Badge } from 'antd-mobile'
import { Context } from '@/layouts'
import io from 'socket.io-client'

export default (props) => {
    const { location: { pathname } } = props
    const { userInfo, host, socket } = useContext(Context)
    const countRef = useRef(0)
    const [remindCount, setRemindCount] = useState(0)

    const arr = [
        { title: 'Home', onClick: () => history.push('/home'), key: '/home', icon: <i className='iconfont icon-home'></i> },
        { title: 'Event', onClick: () => history.push('/event'), key: '/event', icon: <i className='iconfont icon-hot'></i> },
        { title: 'Message', onClick: () => history.push('/user/message'), key: '/user/message', icon: <i className='iconfont icon-message'></i> },
        { title: 'My', onClick: () => history.push('/user/my'), key: '/user/my', icon: <i className='iconfont icon-user'></i> },
    ]

    useEffect(() => {
        socket.open()
        socket.on('remind', function (data) {
            countRef.current += 1
            setRemindCount(countRef.current)
        });
        return () => socket.close()
    }, [])

    return (
        <div>
            <TabBar unselectedTintColor='#888' tintColor='#108ee9'>
                {arr.map(i => {
                    return <TabBar.Item key={i.key} title={i.title} onPress={i.onClick} selected={pathname === i.key} icon={<Badge text={String(remindCount)}>{i.icon}</Badge>} selectedIcon={i.icon} />
                })}
            </TabBar>
        </div>
    )
}
