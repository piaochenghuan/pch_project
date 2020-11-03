
import React, { useState } from 'react'
import { Form, Button, Input, Tabs, message, Upload, Modal } from 'antd'
import { history } from 'umi';
import request from '@/utils/request';
import { PlusOutlined } from '@ant-design/icons';

export default (props: any) => {
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState('')
    const [fileList, setFileList]: any = useState([])
    const [list, setList]: any = useState([])
    const [previewImage, setPreviewImage] = useState()



    function onFinish(values: any) {
        let data = { ...values }
        // 如果有图片上传
        if (fileList.length > 0) {
            console.log(fileList);
            data = new FormData() // 文件必须以form-data数据格式传输
            fileList.forEach((item: any) => {
                data.append('images', item)
            });
            data.append('title', values.title)
            data.append('content', values.content)
            data.append('desc', values.desc || '')
        }

        request({
            url: '/note/add',
            method: 'POST',
            upload: true,
            data
        }).then(res => {
            if (res && res.success) {
                props.history.push('/home')
            }
        })
    };

    function getBase64(file: any) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function handleChange(fileInfo: any) {
        setFileList([...fileList,fileInfo.file])
        setList(fileInfo.fileList)
    }

    async function handlePreview(file: any) {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setVisible(true)
        setTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
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
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Desc"
                    name="desc"
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{ required: true, message: 'Please input your content!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    label="images"
                    name="images"
                >
                    <Upload
                        // action="http://localhost:3000/note/uploadImage"
                        listType="picture-card"
                        fileList={list}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={(file: any) => {
                            // setFileList([...fileList, file])
                            return false
                        }}
                    >
                        {fileList.length >= 9 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">Save</Button>
                    <Button onClick={() => history.goBack()}>Cancel</Button>

                </Form.Item>
            </Form>
            {/* 照片弹窗 */}
            <Modal
                visible={visible}
                title={title}
                footer={null}
                onCancel={() => setVisible(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    )
}