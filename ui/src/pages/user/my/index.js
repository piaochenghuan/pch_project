
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, useLocation } from 'umi';
import { List, WhiteSpace, Tabs, Badge, SearchBar, Button } from 'antd-mobile'
import { Context } from '@/layouts'
import { createForm } from 'rc-form'
import PicView from '@/components/PicView'
import FormItems from '@/components/FormItems'
import { message } from 'antd'
import request from '@/utils/request'

export default function My(props) {
    const { pathname, query: { showPic } } = useLocation()
    const { width, userInfo, setLocalStorage, host } = useContext(Context)
    const avatarUrl = host + userInfo.userAvatar
    const formRef = useRef()
    const inputRef = useRef()
    const [editUsername, setEditUsername] = useState(false)
    const [index, setIndex] = useState(0)
    const [myList, setMylist] = useState([])

    useEffect(() => {
        index === 0 && fetchMyNote()
        index === 1 && fetchMyEvent()
    }, [index])

    function clickEdit() {
        setEditUsername(true)
        inputRef.current.focus()
    }

    function save() {
        if (formRef.current.getFieldError('username')) {
            return message.warning('username is required')
        }

    }

    // 选择文件后更新头像
    function popFileSelector() {
        let input = document.createElement('input');
        input.value = '选择文件';
        input.type = 'file';
        input.onchange = event => {
            const file = event.target.files[0];
            const data = new FormData() // 文件必须以form-data数据格式传输
            data.append('image', file)

            request({
                url: 'uploadAvatar',
                method: 'POST',
                upload: true,
                data
            }).then(res => {
                if (res && res.success) {
                    const temp = { ...userInfo, ...res.data }
                    setLocalStorage('userInfo', temp)
                }
            })

        };
        input.click();
    }


    // 查询列表
    function fetchMyNote(keyword) {
        request({
            url: 'noteQuery',
            params: { keyword, userId: userInfo.userId }
        }).then(res => {
            if (res && res.success) {
                setMylist(res.data.list)
            }
        })
    }
    // 查询列表
    function fetchMyEvent(keyword) {
        request({
            url: 'eventQuery',
            params: { keyword, userId: userInfo.userId }
        }).then(res => {
            if (res && res.success) {
                setMylist(res.data.list)
            }
        })
    }

    function changeAction(action, data = {}, cb) {
        request({
            url: action,
            method: 'post',
            data
        }).then(res => {
            if (res && res.success) {
                cb && cb()
            }
        })
    }



    const tabs = [
        { title: <Badge text={'今日(20)'}>my notes</Badge>, key: 'myNote' },
        { title: <Badge text={'今日(20)'}>my events</Badge>, key: 'myEvent' },
        { title: <Badge text={'3'}>setting</Badge>, key: '' },
        // { title: <Badge dot>ok</Badge>, key: '' },
    ];

    const usernameExtra = editUsername ?
        <a onClick={save}>✓</a> :
        <i className='iconfont icon-editor' onClick={clickEdit}></i>
    return (
        <div >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <img style={{ width: '3rem', height: '3rem' }} src={avatarUrl} onClick={() => history.push({ query: { showPic: true } })} /> &nbsp;
                    <i className='iconfont icon-editor' onClick={popFileSelector}></i>
                </div>
                <FormItems
                    init={form => formRef.current = form}
                    items={[
                        {
                            name: 'username',
                            extra: usernameExtra,
                            ref: inputRef,
                            editable: editUsername,
                            fieldProps: {
                                initialValue: userInfo.username,
                                rules: [{ required: true }]
                            },
                            style: { width: '3rem' },
                            onBlur: (val) => {
                                formRef.current.resetFields()
                                setEditUsername(false)
                            }
                        }
                    ]}
                />
            </div>

            <Tabs tabs={tabs}
                initialPage={0}
                page={index}
                onChange={(tab, index) => setIndex(index)}
            >


            </Tabs>

            {index === 0 && <div>
                <SearchBar placeholder='search...' onSubmit={fetchMyNote} />
                {myList.map(item => {
                    return <div>
                        {item.title}
                        <a onClick={() => changeAction('noteDelete', { noteId: item.noteId }, () => fetchMyNote())}>删除</a>
                    </div>
                })}
            </div>}
            {index === 1 && <div>
                <SearchBar placeholder='search...' onSubmit={fetchMyEvent} />
                {myList.map(item => {
                    return <div>
                        {item.name}
                        <a onClick={() => changeAction('eventDelete', { eventId: item.eventId }, () => fetchMyEvent())}>删除</a>
                    </div>
                })}
            </div>}
            <PicView src={avatarUrl} />
        </div>
    )
}





