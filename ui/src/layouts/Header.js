
import React, { useState, useContext, useEffect } from 'react'
import { history, useLocation } from 'umi';
import { List, NavBar, Icon, Button } from 'antd-mobile'
import { Context } from '@/layouts'

export default (props) => {
    const { pathname, query } = useLocation()
    const { width, userInfo } = useContext(Context)
    const { username } = userInfo
    const [show, setShow] = useState(false)

    const sideContent = [
        { name: '+ Note', key: '/note/add', onClick: () => history.push('/note/add') },
        { name: '+ Event', key: '/event/add', onClick: () => history.push('/event/add') },

    ]

    return (
        <div>
            <NavBar
                mode='light'
                leftContent={<Icon type='ellipsis' onClick={() => setShow(true)} />}
                rightContent={null}
            >
                {username}
            </NavBar>
            <SideBar show={show} onClose={() => setShow(false)} sideContent={sideContent} />
        </div>

    )
}



function SideBar(props) {
    const { show, onClose = () => { }, sideContent } = props
    const { pathname, query } = useLocation()
    const { width, userInfo, host } = useContext(Context)
    const avatarUrl = host + userInfo.userAvatar

    useEffect(() => {
        onClose()
    }, [pathname])

    function logout() {
        localStorage.clear()
        history.push('/login')
    }


    function renderContent() {
        return <List
            renderHeader={<div className='tac'><img className='avatar' src={avatarUrl} /></div>}
            renderFooter={<Button type='warning' onClick={logout}>Log out</Button>}
        >
            {sideContent.map(item => {
                const { name, key, onClick, ele } = item
                if (ele) {
                    return ele
                }
                return <List.Item key={key} onClick={onClick} >
                    <div style={{ textAlign: 'center', color: pathname === key ? '#1890ff' : 'black' }}>  {name}</div>
                </List.Item>
            })}
        </List>

    }

    return (
        <div
            style={{
                backgroundColor: show ? 'rgba(10,10,10,0.6)' : 'rgba(10,10,10,0)',
                width: '2rem',
                position: 'fixed',
                overflow: 'hidden',
                height: '100vh',
                top: '0',
                zIndex: '110',
                transition: 'all 0.2s',
                width: show ? '100%' : '0',
            }}
            onClick={(e) => {
                onClose()
            }}

        >
            <div style={{
                overflow: 'hidden',
                backgroundColor: '#fff',
                width: '40%',
                height: '100%',
            }}
                onClick={e => e.stopPropagation()}
            >
                {renderContent()}
            </div>
        </div>
    )
}