
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, location } from 'umi';
import { TabBar, Badge } from 'antd-mobile'
import { Context } from '@/layouts'
import request from '@/utils/request';

export default (props) => {
    const { location: { pathname } } = props
    const { userInfo, host, socket } = useContext(Context)
    const [remindCount, setRemindCount] = useState(0)

    const arr = [
        { title: 'Home', onClick: () => history.push('/home'), key: '/home', icon: <i className='iconfont icon-home'></i> },
        { title: 'Event', onClick: () => history.push('/event'), key: '/event', icon: <i className='iconfont icon-hot'></i> },
        { title: 'Message', onClick: () => history.push('/user/message'), key: '/user/message', icon: <i className='iconfont icon-comment'></i> },
        { title: 'My', onClick: () => history.push('/user/my'), key: '/user/my', icon: <i className='iconfont icon-user'></i> },
    ]

    useEffect(() => {
        fetchUser()
        socket.open()
        socket.on('remind', function (data) {
            fetchUser()
        });
        return () => socket.close()
    }, [])

    function fetchUser() {
        request({
            url: 'queryUser',
            params: { keyword: userInfo.userId }
        }).then(res => {
            if (res && res.success) {
                setRemindCount(res.data[0].userRemindCount)
            }
        })
    }


    return (
        <div>
            <TabBar unselectedTintColor='#888' tintColor='#108ee9'>
                {arr.map(i => {

                    let count = null
                    if (remindCount && i.key === '/user/message') {
                        count = remindCount.toString()
                    }

                    return <TabBar.Item
                        key={i.key}
                        title={i.title}
                        onPress={i.onClick}
                        selected={pathname === i.key}
                        icon={<Badge text={count}>{i.icon}</Badge>}
                        selectedIcon={<Badge text={count}>{i.icon}</Badge>}
                    />
                })}
            </TabBar>
        </div>
    )
}
