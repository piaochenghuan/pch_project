
import React, { useState, useContext, useEffect, useRef } from 'react'
import { history, useLocation } from 'umi';
import { Button, Drawer, List, NavBar, Icon, InputItem, WhiteSpace } from 'antd-mobile'
import { Context } from '@/layouts'
import { createForm } from 'rc-form'
import PicView from '@/components/PicView'
import FormItems from '@/components/FormItems'
import { message } from 'antd'
import request from '@/utils/request'

export default function My(props) {
    const { pathname, query: { picView } } = useLocation()
    const { width, userInfo, setLocalStorage, host } = useContext(Context)
    const avatarUrl = host + userInfo.userAvatar
    const formRef = useRef()
    const inputRef = useRef()
    const [editUsername, setEditUsername] = useState(false)

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

    const usernameExtra = editUsername ?
        <div>
            <a onClick={save}>save</a>&nbsp;
            <span onClick={() => setEditUsername(false)}>cancel</span>
        </div> :
        <i className='iconfont icon-editor' onClick={clickEdit}></i>
    return (
        <div >
            <List renderHeader={'User Center'}>
                <FormItems
                    init={form => formRef.current = form}
                    items={[
                        {
                            type: 'custom',
                            name: 'userAvatar',
                            element: <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <img style={{ width: '2rem' }} src={avatarUrl} onClick={() => history.push({ query: { picView: true } })} />
                                <i className='iconfont icon-Rightarrow' onClick={popFileSelector}></i>
                            </div>
                        },
                        {
                            label: 'Username: ',
                            name: 'username',
                            extra: usernameExtra,
                            ref: inputRef,
                            editable: editUsername,
                            fieldProps: {
                                initialValue: userInfo.username,
                                rules: [{ required: true }]
                            }
                        }
                    ]}
                />
            </List>
            {picView && <PicView src={avatarUrl} />}
        </div>
    )
}





