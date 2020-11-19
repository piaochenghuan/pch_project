import React, { useEffect, useRef, useState } from 'react'
import style from '../index.less'
import { Input, Button } from 'antd'
import io from 'socket.io-client'
import { getUserInfo } from '@/utils/common'

export default (props) => {
    const [content, setContent] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [hideWindow, setHideWindow] = useState(false)
    const socketRef = useRef(null)
    const chatingWindowRef = useRef(null)

    useEffect(() => {
        socketConnect()
    }, [])

    useEffect(() => {
        chatingWindowRef.current.scrollTop = chatingWindowRef.current.offsetHeight
    }, [content])

    // 连接socket
    function socketConnect() {
        const { username } = getUserInfo()
        socketRef.current = io(`ws://localhost:3000?username=${username}`); // 建立链接

        socketRef.current.on('msg', function (data) { // 监听服务端的消息“msg”
            const temp = <div style={{ textAlign: username !== data.username ? 'left' : 'right' }}>{data.username + ' : ' + data.msg}</div>
            content.push(temp)
            setContent([...content])
        });

        socketRef.current.on('logIn', function (data) { // 监听服务端的消息“msg”
            const temp = <div style={{ textAlign: 'center' }}>{data}</div>
            content.push(temp)
            setContent([...content])
        });
    }

    return (
        <>
            < div className={style.chating_box} >

                {!hideWindow && <>

                    <div style={{ textAlign: 'right', padding: '5px 10px' }}><span style={{ cursor: 'pointer' }} onClick={() => {
                        if (socketRef.current.connected) {
                            socketRef.current.close()
                            setHideWindow(true)
                        }

                    }}>X</span></div>
                    <div className={style.window} ref={chatingWindowRef} >
                        {content.map((i) => <div>{i}</div>)}
                    </div>

                    <Input.TextArea value={inputValue} placeholder='please enter...' onChange={(e) => {
                        setInputValue(e.currentTarget.value)
                    }} />
                    <Button type='primary' onClick={() => {
                        if (socketRef.current.connected && inputValue.trim()) {
                            socketRef.current.emit('msg', inputValue)
                            setInputValue('')
                        }
                    }}>Send</Button>
                </>}
                {hideWindow && <Button type='primary' onClick={() => {
                    if (socketRef.current.disconnected) {
                        socketRef.current.open()
                        setHideWindow(false)
                    }
                }}>Open Chating Room</Button>}
            </div >

        </>
    )
}