
import React, { useState, useContext, useEffect } from 'react'
import { history, location } from 'umi';
import { Button, Drawer, List, NavBar, Icon, TabBar } from 'antd-mobile'
import { Context } from '@/layouts'


export default (props) => {

    const { location: { pathname } } = props
    const arr = [
        { title: 'Home', onClick: () => history.push('/home'), key: '/home', icon: <i className='iconfont icon-home'></i> },
        { title: 'Event', onClick: () => history.push('/event'), key: '/event', icon: <i className='iconfont icon-hot'></i> },
        { title: 'My', onClick: () => history.push('/user/my'), key: '/user/my', icon: <i className='iconfont icon-user'></i> },
    ]


    console.log();
    return (
        <div>
            <TabBar unselectedTintColor='#888' tintColor='#108ee9'>
                {arr.map(i => {
                    return <TabBar.Item key={i.key} title={i.title} onPress={i.onClick} selected={pathname === i.key} icon={i.icon} selectedIcon={i.icon} />
                })}
            </TabBar>
        </div>
    )
}
