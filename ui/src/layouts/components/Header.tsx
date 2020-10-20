
import React from 'react'
import { Form, Button, Input, Tabs, message } from 'antd'
import { history } from 'umi';

export default ()=>{
    return (
        <div>
           <Button type='primary' onClick={()=>{
               history.push('/note/add')
           }}>新建</Button>
        </div>
    )
}