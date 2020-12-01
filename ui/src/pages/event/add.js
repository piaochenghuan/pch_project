
import React, { useState, useRef, useEffect, useContext } from 'react'
import { Button, ImagePicker, DatePicker, List, InputItem, Modal, SearchBar } from 'antd-mobile'
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
                data.callOthers = data.callOthers?.map(i => i.userId)

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
                    // {
                    //     type: 'custom',
                    //     name: 'location',
                    //     fieldProps: {
                    //         rules: [{ required: true }]
                    //     },
                    //     element: props => <Map {...props} />
                    // },
                    {
                        label: 'Location',
                        name: 'location',
                        fieldProps: {
                            rules: [{ required: true }]
                        }
                    },

                    {
                        type: 'textArea',
                        label: 'Content: ',
                        name: 'content',
                        placeholder: "Content...",
                    },
                    {
                        type: 'custom',
                        name: 'callOthers',
                        element: props => {
                            const { value, onChange } = props
                            const [visible, setVisible] = useState(false)
                            const [selected, setSelected] = useState([])


                            useEffect(() => {
                                onChange(selected)
                            }, [selected])


                            return <div style={{ position: 'relative' }}>
                                <InputItem
                                    value={value?.map(i => '@' + i.username)}
                                    placeholder='@ your friends...'
                                    onFocus={() => setVisible(true)}
                                    onBlur={() => setVisible(false)}
                                    onKeyUp={e => {
                                        if (e.key === 'Backspace' && selected.length > 0) {
                                            selected.pop()
                                            setSelected([...selected])
                                        }
                                    }}
                                />
                                <SelectUser
                                    visible={visible}
                                    onClose={() => setVisible(false)}
                                    onChange={item => {
                                        if (selected.find(i => i.userId === item.userId)) {
                                            return
                                        } else {
                                            selected.push(item)
                                        }
                                        setSelected([...selected])
                                    }}
                                />
                            </div>
                        }


                    },
                    // {
                    //     type: 'custom',
                    //     name: 'images',
                    //     element: props => {
                    //         const { onChange, value } = props
                    //         return <ImagePicker
                    //             files={value}
                    //             onChange={(files, operationType, index) => {
                    //                 onChange(files)
                    //             }}
                    //             onImageClick={(index, fs) => console.log(index, fs)}
                    //             selectable={true}
                    //             multiple={true}
                    //         />
                    //     }
                    // },
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

// 选择用户组件
function SelectUser(props) {
    const {
        visible = false,
        onClose = () => { },
        onChange = () => { },
    } = props

    const [list, setList] = useState([])

    useEffect(() => {
        fetchList()
    }, [])

    function fetchList(keyword = '') {
        request({
            url: 'queryUser',
            params: { keyword }
        }).then(res => {
            if (res && res.success) {
                setList(res.data)
            }
        })
    }

    function selectUser(item) {
        onChange(item)
    }
    return (
        <div style={{
            position: 'absolute',
            height: visible ? '10rem' : '0',
            transition: 'all 0.3s',
            width: '100%',
            zIndex: '199',
            top: 0,
            left: 0,
            overflow: 'scroll',
            backgroundColor: '#fff',
            transform: 'translateY(-100%)',
            boeder: visible ? '1px solid #ddd' : 'none'
        }}
        >
            {/* <SearchBar placeholder='search...' onSubmit={fetchList} /> */}
            <div >
                <List renderHeader={'Select User'} >
                    {list.map(item => {
                        return <List.Item onClick={() => selectUser(item)} >{item.username}</List.Item>
                    })}
                </List>
            </div>
        </div>
    )
}



