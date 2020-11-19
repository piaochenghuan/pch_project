
import React, { useState, useContext, useEffect, useRef } from 'react'
import { createForm } from 'rc-form'
import { Button, Drawer, List, NavBar, Icon, InputItem, WhiteSpace, WingBlank } from 'antd-mobile'

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

    function renderFormItems() {
        return items.map(item => {
            const { type = 'input', fieldProps = {} } = item

            if (type === 'textArea') {
                return <TextareaItem
                    {...getFieldProps(item.name, {
                        ...fieldProps
                    })}
                    {...item}
                >{item.label}</TextareaItem>
            } else if (type === 'custom') {

                return <WingBlank >
                    {item.element}
                </WingBlank>
            } else {
                return <InputItem
                    {...getFieldProps(item.name, { ...fieldProps })}
                    {...item}
                >{item.label}</InputItem>
            }
        })
    }
    return (
        <div>
            {renderFormItems()}
        </div>
    )
})