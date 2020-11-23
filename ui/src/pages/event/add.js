
import React, { useState, useRef } from 'react'
import { TextareaItem, Button, ImagePicker, DatePicker, List } from 'antd-mobile'
import { history } from 'umi';
import request from '@/utils/request';
import { message } from 'antd';
import FormItems from '@/components/FormItems'
import moment from 'moment'

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
                data.eventTime = moment(data.eventTime).format('YYYY-MM-DD HH:mm')

                request({
                    url: 'eventAdd',
                    method: 'POST',
                    upload: true,
                    data
                }).then(res => {
                    if (res && res.success) {
                        props.history.push('/event')
                    }
                })
            } else {
                message.warning('必填')
            }
        })
    }
    return (
        <div>
            <FormItems
                init={form => formRef.current = form}
                items={[
                    {
                        label: 'Name',
                        name: 'name',
                        placeholder: "name...",
                        fieldProps: {
                            rules: [{ required: true }]
                        },
                    },
                    {
                        label: 'Location',
                        name: 'location',
                        placeholder: "location...",
                        fieldProps: {
                            rules: [{ required: true }]
                        },
                    },
                    {
                        type: 'custom',
                        name: 'eventTime',
                        fieldProps: {
                            rules: [{ required: true }]
                        },
                        element: props => {
                            const { onChange, value } = props
                            return <DatePicker
                                mode='datetime'
                                value={value}
                                onChange={date => onChange(date)}
                            >
                                <List.Item arrow="horizontal">Date</List.Item>
                            </DatePicker>
                        }
                    },
                    {
                        type: 'textArea',
                        label: 'Content: ',
                        name: 'content',
                        placeholder: "Content...",
                    },
                    {
                        name: 'callOthers',
                        placeholder: "@ your friends...",
                        editable: false,
                        extra: <a>call</a>
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