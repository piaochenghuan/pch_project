
import React from 'react'
import { Form, Button, Input, Tabs, message } from 'antd'
import { history } from 'umi';
import request from '@/utils/request';

export default (props: any) => {
    function onFinish(values: any) {
        request({
            url: '/note/add',
            method: 'POST',
            body: values
        }).then(res => {
            if (res.success) {
                props.history.push('/home')
            } else {
                message.warning(res.msg)
            }
        })
    };
    return (
        <div>
            <Form
                name="basic"
                initialValues={{}}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input your title!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please input your content!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">Save</Button>
                    <Button onClick={() => history.goBack()}>Cancel</Button>

                </Form.Item>
            </Form>
        </div>
    )
}