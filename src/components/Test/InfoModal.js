import React from 'react'
import { Modal, Form, Row, Col, Input, DatePicker, Select } from 'antd'
import { inject, observer } from 'mobx-react'
import { createFormItemObj } from '@/utils/utils'

const FormItem = Form.Item
const Option = Select.Option

const form = Form.create({
    onFieldsChange (props, changedFields) {
        props.testStore.onFieldsChange(changedFields, 'infoFields')
    },
    mapPropsToFields (props) {
        return createFormItemObj(props.testStore.infoFields)
    },
})

@inject('testStore') @form @observer
class InfoModal extends React.Component {

    close = () => {
        this.props.testStore.setStore({
            showInfoModal: false
        })
    }
    save = ()=>{
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.testStore.save()
            }
        })
    }

    render () {
        const {testStore, form} = this.props
        const {showInfoModal} = testStore
        const {getFieldDecorator} = form

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        }

        return (
            <Modal
                onOk={this.save}
                width={800}
                onCancel={this.close}
                visible={showInfoModal}
                title={'详细信息'}>
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem label={'姓名'} {...formItemLayout}>
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入姓名'}],
                                })(<Input placeholder={'请输入姓名'}/>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'年龄'} {...formItemLayout}>
                                {getFieldDecorator('age', {
                                    rules: [
                                        {required: true, message: '请输入年龄'},
                                        {pattern: /^[0-9]*$/, message: '请输入正确的年龄'}
                                    ],

                                })(<Input placeholder={'请输入年龄'}/>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'出生年月日'} {...formItemLayout}>
                                {getFieldDecorator('birth', {
                                    rules: [{required: true, message: '请选择出生日期'}],
                                })(<DatePicker style={{width: '100%'}}/>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'性别'} {...formItemLayout}>
                                {getFieldDecorator('gender', {
                                    rules: [{required: true, message: '请选择性别'}],
                                })(<Select placeholder={'请选择性别'} style={{width: '50%'}}>
                                    <Option value={'男'}>男</Option>
                                    <Option value={'女'}>女</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'电话'} {...formItemLayout}>
                                {getFieldDecorator('phone', {})(<Input placeholder={'请输入电话'}/>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'家庭地址'} {...formItemLayout}>
                                {getFieldDecorator('address', {})(<Input placeholder={'请输入家庭地址'}/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default InfoModal