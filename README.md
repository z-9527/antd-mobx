### antd和mobx结合使用

主要介绍mobx的store值是如何回显到antd的Form组件上，Form组件的值又是如何绑定到store中  
<a href="https://zhangzhihao1996.github.io/antd-mobx/" target="_blank">预览在线demo</a>
![](https://github.com/zhangZhiHao1996/image-store/blob/master/antd-mobx/03.png?raw=true)


对自己在使用antd+mobx遇见的一些问题做一下总结



在antd中，稍微复杂一点的就是**Table**和**Form**组件，下面总结自己在使用过程中遇见的问题
<br/>


### Table组件

![](https://github.com/zhangZhiHao1996/image-store/blob/master/antd-mobx/01.png?raw=true)

```javascript
const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
}];

<Table dataSource={dataSource} columns={columns} />
```

最简单的表格就是由表头和表格数据组成的
<br/>


**columns**

表格表头，它是一个对象数组，数组的每一项代表一列,介绍一下每列表头常见的属性

```react
{
    title: '姓名',                    //表头显示的名字
    dataIndex: 'name',               //这个字段很重要，是让表格数据匹配这一列的数据，
    key: 'name',                     //React遍历数组都需要key(dataIndex和key至少存在一个)
    align:'center'                   //对齐方式
    render:(text,record)=><div>...</dvi>
                                     //创建复杂的视图，Table默认创建当前dataIndex对应字段的字符串，通过render可以重新创建视图。
        ....
}
```

columns更多的属性可以参考antd的官网
<br/>


**dataSource**

表格的数据，表格的数据源。当一个表格有了表头后，要给表格添加数据。

dataSource是一个数组，Table组件会自动遍历这个数组然后添加到页面中。

dataSource是如何将数据匹配到某一列的?

"胡彦祖"不会放到“年龄”那一列

“32”不会放到“姓名”那一列

```javascript
const dataSource = [{
  key: '1',
  name: '胡彦斌',                      //这个字段会放到表头dataIndex为name那一列中去
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
}];
```
<br/>


**rowKey**

表头数据有一个key或dataIndex，表格数据也应该有，默认为’key‘

```
<Table 
	rowKey={'id'}                
	dataSource={dataSource} 
	columns={columns} />
```

rowKey指定表格每一行的key，默认是dataSource数组项中的属性key，当dataSource数组项中没有key属性时需要指定**一个不重复的值**来作为表格行的key，可以是id或其他任何不重复的属性。

`缺少key时页面会有错误提示`
<br/>


**loading**
表格加载的loading
<br/>


**scroll**

表格滚动

```javascript
<Table 
	scroll={{x:500,y:500}}       
	dataSource={dataSource} 
	columns={columns} />
```

设置横向或纵向滚动，也可用于指定滚动区域的宽和高，建议为 `x` 设置一个数字，如果要设置为 `true`，需要配合样式 `.ant-table td { white-space: nowrap; }`

注意表格滚动后，表头和表格数据可能不对齐，这时候**必须**给表头的设置宽度（**不能所有项都设置宽度**）

```
const columns = [{
  title: '姓名',
  dataIndex: 'name',
  width:120,               //设置宽度
  key: 'name',
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age',
  width:120,             //设置宽度
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',         //没有设置宽度
}];
```

在设置宽度时一定要让表格有一列没有设置宽度，如果给每一项设置宽度，表格总宽度被定死，有滚动时还是会出现不对齐的情况，留一列让它自适应
<br/>


**rowClassName**

表格行的class类名，当要让行点击后变色就是在这里设置的

```javascript
<Table 
    rowClassName={(record)=>{
		 let classNames= ''
         if(record.id === this.state.selectFourMenu){
             classNames += 'row-select'
         }
        return classNames
    }}  
	dataSource={dataSource} 
	columns={columns} />
```

rowClassName属性接收一个函数，会为每一行执行这个函数，函数的返回值就是当前行的类名。

当我们要做点击行变色时，可以在行的点击事件保存当前点击行的id，然后在rowClassName的函数中判断当前行是否是点击的行，若是就添加一个css类名让行变色。
<br/>




Table还有其他稍微复杂的属性，比如表格的勾选框，表格的展开行等等，不过不常用就不介绍了，如果有需要就去逛网照着例子过一遍即可。
<br/>


**表格的事件**

| onChange             | 分页、排序、筛选变化时触发 | Function(pagination, filters, sorter, extra: { currentDataSource: [] }) |      |
| -------------------- | -------------------------- | ------------------------------------------------------------ | ---- |
| onExpand             | 点击展开图标时触发         | Function(expanded, record)                                   |      |
| onExpandedRowsChange | 展开的行变化时触发         | Function(expandedRows)                                       |      |
| onHeaderRow          | 设置头部行属性             | Function(column, index)                                      |      |
| onRow                | 设置行属性                 | Function(record, index)                                      |      |

重点介绍一下onRow

```javascript
<Table
  onRow={(record) => {
    return {
      onClick: () => {},       // 点击行
      onMouseEnter: () => {},  // 鼠标移入行
      onXxxx...
    };
  }}
/>
```

要设置行的点击事件、鼠标移入事件都是通过onRow设置的

onRow接收一个函数，函数返回一个事件集合，参数record为当前行的数据
<br/>
<br/>



### Form组件

Form组件稍微复杂点，主要涉及到的是表单的双向绑定。

我遇见了两个问题：

- 表单不回显
- 表单错误不提示



先介绍一下React的“受控组件”

为了控制表单的回显或存值，我们需要让表单双向绑定，也就是React说的“受控组件”。

```javascript
class Test extends React.Component{

    state = {
        value:''
    }

    onChange = (e)=>{
        this.setState({
            value:e.target.value
        })
    }

    render(){
        return (
            <div>
                <Input value={this.state.value} onChange={this.onChange}/>
            </div>
        )
    }
}
```

上面就实现了一个表单的双向绑定：

- state的值通过value绑定到了Input上
- Input的值通过onChange绑定到了state上

当然表单也可以绑定到store中，逻辑是一样的
<br/>


在项目中，有时候只需要一个查询条件，用上面的方法来实现表单的双向绑定即可。若查询条件过多，每个表单元素都要自己实现双向绑定就显得过于麻烦。antd提供Form组件来实现表单的双向绑定。
<br/>


先介绍一下基本原理，然后再说细节

```react
<Form>
    <FormItem label={'姓名'}>
        {getFieldDecorator('name',{})(<Input/>)}
    </FormItem>
</Form>


```

![](https://github.com/zhangZhiHao1996/image-store/blob/master/antd-mobx/02.png?raw=true)

上面通过Form就已经实现了表单的双向绑定

Form组件已经帮我实现手动绑定的过程，通过Form组件提供的API就能达到目的。

getFieldDecorator是关键，他是Form提供用来双向绑定的API。

经过getFieldDecorator包装的控件，表单控件会自动添加value和onChange。数据同步将被 Form 接管

- this.props.form.getFieldsValue方法可以得到表单的值
- this.props.form.setFieldsValue方法可以设置表单的值

<br/>

**我们项目更多的是将store和表单双向绑定，所以下面重点介绍store如何与Form组合使用。**

```react
...
class TestStore {
    @observable searchFields

    constructor (){
        this.searchFields = {
            name:'',
            age:0
        }
    }
}

...
<FormItem label={'姓名'}>
	{getFieldDecorator('name',{})(<Input/>)}
</FormItem>
```

表单和store联系起来是通过onFieldsChange和mapPropsToFields来双向绑定的

```javascript
const form = Form.create({
    onFieldsChange(props, changedFields){
        
    }
   	mapPropsToFields(){
        
   	}
})
```

- 当**表单变化时**会触发onFieldsChange，在这里可以将变化的表单值绑定到store中

- 当**表单所在的组件接收的props变化时**就会触发mapPropsToFields，在这里将store中的值再回显到表单中。

<br/>

**注意这里并不是store变化就一定会触发mapPropsToFields**，有时候我们清空了store中的searchFields而页面并没有清空（最后是通过this.props.form.resetFields清空的 ）就是因为**mapPropsToFields没有触发**。最后找了很久才发现mapPropsToFields的触发条件。

mapPropsToFields是在组件的***componentWillReceiveProps***的生命周期中调用的，所以我们只需要触发*componentWillReceiveProps*即可。

<br/>

*componentWillReceiveProps*的触发条件是组件接收新的props。虽然store也是绑定到props上的。但store的改变有时候并没有触发生命周期。所以我们需要手动传递一个props。


















