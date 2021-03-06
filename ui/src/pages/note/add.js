
import React, { useState, useRef } from 'react'
import { TextareaItem, Button, ImagePicker } from 'antd-mobile'
import { history } from 'umi';
import request from '@/utils/request';
import { message } from 'antd';
import FormItems from '@/components/FormItems'

export default (props) => {
    const formRef = useRef()

    function save() {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                
                let data = values
                // 如果有图片上传
                if (values?.images?.length > 0) {
                    data = new FormData() // 文件必须以form-data数据格式传输
                    values.images.forEach((item) => {
                        data.append('images', item.file)
                    });
                    data.append('title', values.title)
                    data.append('content', values.content)
                    data.append('desc', values.desc)
                }

                request({
                    url: 'noteAdd',
                    method: 'POST',
                    upload: true,
                    data
                }).then(res => {
                    if (res && res.success) {
                        props.history.push('/home')
                    }
                })
            } else {
                message.warning('必填')
            }
        })
    };




    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <FormItems
                init={form => formRef.current = form}
                items={[
                    {
                        type: 'textArea',
                        label: 'Title: ',
                        name: 'title',
                        placeholder: "Title...",
                        fieldProps: {
                            rules: [{ required: true }]
                        },
                        rows: 2

                    },
                    {
                        type: 'textArea',
                        label: 'Content: ',
                        name: 'content',
                        placeholder: "Content...",
                        fieldProps: {
                            rules: [{ required: true }]
                        },

                    },
                    {
                        type: 'custom',
                        name: 'images',
                        element: props => {
                            const { onChange, value } = props
                            return <ImagePicker
                                files={value}
                                onChange={(files, operationType, index) => {
                                    onChange(files)
                                }}
                                onImageClick={(index, fs) => console.log(index, fs)}
                                selectable={true}
                                multiple={true}
                            />
                        }
                    },
                ]}
            />
            <Button type='primary' onClick={save}>Save</Button>
        </div>
    )
}


