import { Form } from 'antd'

/**
 * 创建FormItem回显到表单的对象
 * @param obj
 * @returns {{}}
 */
export function createFormItemObj (obj) {
    let target = {}
    for (let [key, value] of Object.entries(obj)) {
        target[key] = Form.createFormField(value)
    }
    return target
}

/**
 * 清空对象
 * @param obj
 * @returns {{}}
 */
export function clearFields (obj) {
    let target = {}
    for (let key of Object.keys(obj)) {
        target[key] = {}
    }
    return target
}

/**
 * { test:{value} } ==> {test:value}
 */
export function valueObjToObj (obj) {
    let target = {}
    for (let [key, value] of Object.entries(obj)) {
        target[key] = value.value
    }
    return target
}

/**
 *  {test:value} ==> {test:{value}}
 * @param obj
 * @returns {{}}
 */
export function objToValueObj (obj) {
    let target = {}
    for (let [key, value] of Object.entries(obj)) {
        target[key] = {value}
    }
    return target
}