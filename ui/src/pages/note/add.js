
import React, { useState } from 'react'
import { TextareaItem, Button, ImagePicker } from 'antd-mobile'
import { history } from 'umi';
import request from '@/utils/request';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';

export default (props) => {
    const [fileList, setFileList] = useState([])
    const [values, setValues] = useState({})



    function onFinish() {
        let data = { ...values }
        // 如果有图片上传
        if (fileList.length > 0) {
            console.log(fileList);
            data = new FormData() // 文件必须以form-data数据格式传输
            fileList.forEach((item) => {
                data.append('images', item.file)
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

    function handleChange(val, field) {
        values[field] = val
        setValues({ ...values })
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>


            <div style={{ flex: '1' }}>
                <TextareaItem
                    title="Title"
                    placeholder="title..."
                    autoHeight
                    onChange={(val) => handleChange(val, 'title')}
                />
                <TextareaItem
                    title="Desc"
                    placeholder="desc..."
                    autoHeight
                    onChange={(val) => handleChange(val, 'desc')}
                />
                <TextareaItem
                    rows={15}
                    placeholder="Content..."
                    onChange={(val) => handleChange(val, 'content')}
                />

                <ImagePicker
                    files={fileList}
                    onChange={(files, operationType, index) => {
                        setFileList(files)
                    }}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={true}
                    multiple={true}
                />
            </div>
            <Button type='primary' onClick={onFinish}>Save</Button>
        </div>
    )
}