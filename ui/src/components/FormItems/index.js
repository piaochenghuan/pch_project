
import React, { useState, useContext, useEffect, useRef } from 'react'
import { createForm } from 'rc-form'
import { InputItem, WhiteSpace, WingBlank, TextareaItem, List } from 'antd-mobile'

export default createForm()((props) => {
    const {
        form,
        items = [],
        init
    } = props
    const { getFieldProps, setFieldsValue, validateFields, getFieldsValue, setFieldsInitialValue } = form

    useEffect(() => {
        init && init(form)
    }, [])

    return (
        <div>
            {<List>
                {items.map(item => {
                    const { type = 'input', fieldProps = {}, element: Element } = item
                    let node
                    if (type === 'textArea') {
                        node = <TextareaItem
                            {...getFieldProps(item.name, {
                                ...fieldProps
                            })}
                            rows={item.rows || 3}
                            {...item}
                        >{item.label}</TextareaItem>
                    } else if (type === 'custom') {
                        node = typeof Element === 'function' ? <Element {...getFieldProps(item.name, {
                            ...fieldProps
                        })} /> : Element
                    } else {
                        node = <InputItem
                            {...getFieldProps(item.name, { ...fieldProps })}
                            {...item}
                        >{item.label}</InputItem>
                    }
                    return node
                })}
            </List>}
        </div>
    )
})