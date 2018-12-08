import { observable, action } from 'mobx'
import { clearFields, valueObjToObj, objToValueObj } from '@/utils/utils'
import { Modal,message } from 'antd'
import uuid from 'uuid/v4'
import moment from 'moment'

class TestStore {
    @observable showInfoModal //显示弹框
    @observable infoFields   //信息
    @observable infoList    //信息列表
    @observable editId     //编辑的ID

    constructor () {
        this.showInfoModal = false
        this.infoFields = {
            name: {},
            age: {},
            birth: {},
            gender: {},
            phone: {},
            address: {}
        }
        this.infoList = []
        this.editId = ''
    }

    /**
     * 设置store对象，类似react的setState
     * @param obj
     */
    @action
    setStore = (obj) => {
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            for (let [key, value] of Object.entries(obj)) {
                this[key] = value
            }
        }
    }

    /**
     * 获取infoList
     */
    @action
    getInfoList = () => {
        const infoList = localStorage.getItem('infoList') ? JSON.parse(localStorage.getItem('infoList')) : []
        this.infoList = infoList
    }

    /**
     * 打开编辑的弹框
     * @param record
     */
    @action
    openInfoModal = (record) => {
        this.infoFields = clearFields(this.infoFields)
        if (record) {
            //回显
            this.infoFields = {
                ...objToValueObj(record),
                birth: {value: moment(record.birth)}
            }
        }
        this.editId = record && record.id
        this.showInfoModal = true
    }

    /**
     * 表单变化绑值到store中
     * @param changedFields    变化的表单值
     * @param fields          绑定到store的哪一个值上
     */
    @action
    onFieldsChange = (changedFields, fields) => {
        this[fields] = {...this[fields], ...changedFields}
    }

    /**
     * 删除一条记录
     * @param id
     */
    @action
    removeRecord = (id) => {
        Modal.confirm({
            title: '提示',
            content: '确认删除当前记录吗',
            okType: 'danger',
            onOk: () => {
                let infoList = this.infoList.filter(item => item.id !== id)
                localStorage.setItem('infoList', JSON.stringify(infoList))
                this.getInfoList()
            }
        })
    }

    /**
     * 弹框的确定按钮
     */
    @action
    save = () => {
        let infoList = []
        if (this.editId) {
            infoList = this.editRecord(this.editId)
        } else {
            infoList = this.addRecord()
        }
        localStorage.setItem('infoList', JSON.stringify(infoList))
        this.getInfoList()
        this.showInfoModal = false
        message.success(this.editId ? '编辑成功' : '创建成功')
    }
    /**
     * 添加一条记录
     */
    addRecord = () => {
        let infoList = this.infoList.slice()

        let info = valueObjToObj(this.infoFields)
        info.birth = info.birth && info.birth.format('YYYY-MM-DD')   //处理日期
        info.id = uuid()  //构造数据id

        infoList.unshift(info)
        return infoList
    }
    /**
     * 修改数组中的某一项
     * @param id   要修改的id
     */
    editRecord = (id) => {
        let infoList = this.infoList.slice()
        const index = infoList.findIndex(item => item.id === id)

        let info = valueObjToObj(this.infoFields)
        info.birth = info.birth && info.birth.format('YYYY-MM-DD')   //处理日期

        infoList.splice(index, 1, info)  //替换
        return infoList
    }
}

export default new TestStore()