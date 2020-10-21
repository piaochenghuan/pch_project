import React, { useEffect, useRef, useState } from 'react'
import style from '../index.less'
import { Input, Button } from 'antd'
import io from 'socket.io-client'

export default (props: any) => {
    const [content, setContent]: any = useState([])
    const [inputValue, setInputValue]: any = useState('')
    const socketRef: any = useRef(null)


    useEffect(() => {
        const username = localStorage.getItem('username')
        socketRef.current = io(`ws://127.0.0.1:3000?username=${username}`); // 建立链接
        // 此时会触发后台的connect事件
        socketRef.current.on('msg', function (data: any) { // 监听服务端的消息“msg”
            const temp = <div style={{ textAlign: username !== data.username ? 'left' : 'right' }}>{data.username + ' : ' + data.msg}</div>
            content.push(temp)
            setContent([...content])
        });

        socketRef.current.on('logIn', function (data: any) { // 监听服务端的消息“msg”
            const temp = <div style={{ textAlign: 'center' }}>{data}</div>
            content.push(temp)
            setContent([...content])
        });

    }, [])
    return (
        < div className={style.chating_box} >
            <div className={style.top}>
                <div style={{ textAlign: 'right', padding: '5px 10px' }}><span style={{ cursor: 'pointer' }}>X</span></div>
                <div>
                    {content.map((i: any) => <div>{i}</div>)}
                </div>
            </div>
            <Input.TextArea value={inputValue} placeholder='please enter...' onChange={(e) => {
                setInputValue(e.currentTarget.value)
            }} />
            <Button type='primary' onClick={() => {
                if (socketRef.current.connected) {
                    socketRef.current.emit('msg', inputValue)
                    setInputValue('')
                }
            }}>Send</Button>
        </div >
    )
}