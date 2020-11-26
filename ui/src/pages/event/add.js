
import React, { useState, useRef, useEffect } from 'react'
import { TextareaItem, Button, ImagePicker, DatePicker, List, InputItem } from 'antd-mobile'
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
                        type: 'custom',
                        name: 'location',
                        fieldProps: {
                            rules: [{ required: true }]
                        },
                        element: props => <Map {...props} />
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


// 地图组件
function Map(props) {
    const { value, onChange } = props

    useEffect(() => {
        var map = new AMap.Map("mapContainer", {
            resizeEnable: true,
            center: [116.397428, 39.90923],//地图中心点
            zoom: 13,//地图显示的缩放级别
            keyboardEnable: false
        });
        AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
            var autoOptions = {
                city: "北京", //城市，默认全国
                input: "keyword"//使用联想输入的input的id
            };
            var autocomplete = new AMap.Autocomplete(autoOptions);

            var placeSearch = new AMap.PlaceSearch({
                city: '北京',
                map: map
            })
            AMap.event.addListener(autocomplete, "select", function (e) {
                //TODO 针对选中的poi实现自己的功能
                placeSearch.setCity(e.poi.adcode);
                placeSearch.search(e.poi.name)
                onChange && onChange(e.poi.name)
            })
        })
    }, [])

    return (
        <div >
            <InputItem id="keyword" placeholder="location..." value={value} onChange={val => onChange(val)} >Location</InputItem>
            <div id="mapContainer" style={{ position: 'relative', height: '10rem', width: '100%' }}></div>
        </div>
    )
}