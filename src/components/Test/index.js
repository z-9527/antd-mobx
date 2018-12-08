import React from 'react'
import { Button,Table,Icon,Divider} from 'antd'
import {inject,observer} from 'mobx-react'
import InfoModal from './InfoModal'

@inject('testStore')  @observer
class Test extends React.Component{

    componentDidMount(){
        this.props.testStore.getInfoList()
    }

    open = ()=>{
        this.props.testStore.openInfoModal()
    }

    remove = (id)=>{
        this.props.testStore.removeRecord(id)
    }
    edit = (record)=>{
        this.props.testStore.openInfoModal(record)
    }

    render(){
        const {infoFields,infoList} = this.props.testStore
        const columns = [
            {title:'姓名',dataIndex:'name',align:'center'},
            {title:'年龄',dataIndex:'age',align:'center'},
            {title:'性别',dataIndex:'gender',align:'center'},
            {title:'出生日期',dataIndex:'birth',align:'center'},
            {title:'电话',dataIndex:'phone',align:'center'},
            {title:'操作',dataIndex:'action',align:'center',render:(text,record)=><div>
                <span style={styles.test} onClick={()=>this.edit(record)}><Icon type={'edit'}/> 编辑</span>
                <Divider type={'vertical'}/>
                <span style={styles.test} onClick={()=>this.remove(record.id)}><Icon type={'delete'}/> 删除</span>
            </div>},
        ]
        return (
            <div style={{width:800,margin:'100px auto'}}>
                <div style={{textAlign:'right',marginBottom:10}}>
                    <Button icon={'plus'} type={'primary'} onClick={this.open}>新增</Button>
                </div>
                <Table
                    rowKey={'id'}
                    dataSource={infoList}
                    columns={columns}
                    bordered/>
                {/*这里传递一个props主要是为了触发mapPropsToFields*/}
                <InfoModal infoFields={infoFields}/>
            </div>
        )
    }
}

const styles = {
    test:{
        color: '#1890ff',
        cursor: 'pointer'
    }
}

export default Test