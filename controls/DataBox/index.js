import { observer } from 'mobx-react';
import Control from '../Control';
import {
  Button,
  Modal,
  Input,
  InputNumber,
  Radio,
  Select,
  Row,
  Col,
  Table,
  Form,
  Popconfirm,
  message
} from 'antd';
import './index.less';
import React from 'react';
import { toJS } from 'mobx';
import { methods } from '../../common/pointcut';

const EditableContext = React.createContext();

const EditableRow = ({ form, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const defaultPlaceholder = {
  code: 0,
  data: {
    info: {
      a: 1 // 这里开始是正经数据
    }
  },
  msg: '成功',
  stat: 1
};

const RULE_PARAMS = [
  {
    index: '0',
    key: 'ruleId',
    type: 'query',
    dataType: 'String',
    value: '',
    description: '规则ID'
  },
  {
    index: '1',
    key: 'type',
    type: 'query',
    dataType: 'String',
    value: 'gray',
    description: '环境变量'
  },
  {
    index: '2',
    key: '_canche',
    type: 'fix',
    dataType: 'Boolean',
    value: false,
    description: '是否使用缓存'
  }
];
class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };
  renderCell = (form) => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0, width: '100%' }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={(node) => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const { editable, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

@observer
class DataBox extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '变量名称',
        dataIndex: 'key',
        editable: true,
        width: '16%'
      },
      {
        title: '数据来源',
        dataIndex: 'type',
        editable: false,
        width: '16%',
        render: (text, record) => (
          <Select
            placeholder="请选择参数来源"
            style={{ width: '100%' }}
            defaultValue={record.type}
            onChange={(value) => this.changeDataSource(value, record, 'type')}
          >
            <Select.Option value="query">当前页面url参数</Select.Option>
            <Select.Option value="fix">固定值</Select.Option>
            <Select.Option value="pagestate">页内变量</Select.Option>
          </Select>
        )
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        editable: false,
        width: '16%',
        render: (text, record) => {
          return (
            <Select
              placeholder="请选择参数来源"
              style={{ width: '100%' }}
              defaultValue={record.dataType || 'String'}
              onChange={(value) =>
                this.changeDataSource(value, record, 'dataType')
              }
            >
              <Select.Option value="String">字符串</Select.Option>
              <Select.Option value="Number">数字</Select.Option>
              <Select.Option value="Boolean">布尔值</Select.Option>
            </Select>
          );
        }
      },
      {
        title: '值',
        dataIndex: 'value',
        editable: false,
        width: '16%',
        render: (text, record) => {
          return (
            <React.Fragment>
              {(record.dataType === 'String' || !record.dataType) && (
                <Input
                  style={{ width: '100%' }}
                  placeholder="请输入初始值"
                  value={text}
                  onChange={(e) => this.onValueChange(e, record, 'value')}
                />
              )}
              {record.dataType === 'Number' && (
                <InputNumber
                  style={{ width: '100%' }}
                  type="number"
                  placeholder="请输入初始值"
                  value={text || 0}
                  onChange={(e) => this.onValueChange(e, record, 'value')}
                />
              )}
              {record.dataType === 'Boolean' && (
                <Select
                  placeholder="请输入初始值"
                  style={{ width: '161px' }}
                  key={Boolean(text)}
                  defaultValue={Boolean(text)}
                  onChange={(e) => this.onValueChange(e, record, 'value')}
                >
                  <Select.Option value={true}>true</Select.Option>
                  <Select.Option value={false}>false</Select.Option>
                </Select>
              )}
            </React.Fragment>
          );
        }
      },
      {
        title: '变量描述',
        dataIndex: 'description',
        editable: true,
        width: '16%'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '16%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="确定要删除吗"
              onConfirm={() => this.handleDelete(record.index)}
            >
              <Button
                style={{ marginLeft: '16px' }}
                type="primary"
                size={'small'}
              >
                删除
              </Button>
            </Popconfirm>
          ) : null
      }
    ];
    this.state = {
      dataOrigin: 'json',
      jsonValue: '',
      dataBoxVisible: false,
      dataSource: [
        {
          index: '0',
          key: 'name',
          type: 'fix',
          dataType: 'String',
          value: 'zhangyan',
          description: '姓名'
        }
      ],
      requestUrl: '',
      count: 1,
      response: '',
      method: 'POST'
    };
  }
  ok = async () => {
    let { attribute, namespace, element } = this.props;
    let responseData;
    try {
      let value =
        this.state.dataOrigin == 'json'
          ? this.state.jsonValue
          : this.state.response;
      responseData = value ? JSON.parse(value) : {};
    } catch (err) {
      return Modal.error({
        title: 'json格式不正确'
      });
    }
    let computedAttribute = await methods['beforeUpdateHook'](
      element,
      attribute,
      {
        dataOrigin: this.state.dataOrigin,
        responseData,
        requestUrl: this.state.requestUrl,
        method: this.state.method,
        params: this.state.dataSource
      },
      namespace
    );
    if (!element.modify) {
      element[attribute] = computedAttribute[attribute];
    } else {
      for (let key in computedAttribute) {
        if (key !== namespace) {
          await element.modify({
            [key]: computedAttribute[key]
          });
        } else {
          await element.modify(computedAttribute[namespace], namespace);
        }
      }
    }
    this.setState({
      dataBoxVisible: false
    });
  };
  cancel = () => {
    this.setState({
      dataBoxVisible: false
    });
  };
  openDataBox = () => {
    let { attribute, namespace, element, project } = this.props;
    let defaultUrl = '';
    let defaultParams = [];
    // if (project.ruleId) {
    //   defaultUrl = `${location.protocol}//`;
    //   defaultParams = RULE_PARAMS;
    // }
    const value = namespace
      ? toJS(element[namespace][attribute])
      : toJS(element[attribute]);
    const responseData =
      value.responseData && Object.keys(value.responseData).length
        ? JSON.stringify(value.responseData, '', 1)
        : '';
    this.setState(
      Object.assign(
        {
          dataBoxVisible: true,
          dataOrigin: value.dataOrigin ? value.dataOrigin : 'json',
          method: value.method || 'POST',
          requestUrl: value.requestUrl || defaultUrl,
          dataSource: value.params.length ? value.params : defaultParams,
          count: (value.params.length ? value.params : defaultParams).length
        },
        value.dataOrigin == 'request'
          ? {
              response: responseData
            }
          : {
              jsonValue: responseData
            }
      )
    );
  };
  changeValue = (e) => {
    this.setState({
      jsonValue: e.target.value
    });
  };
  changeDataOrigin = (e) => {
    this.setState({
      dataOrigin: e.target.value
    });
  };
  handleDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.index !== index)
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.index === item.index);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData
    });
  };
  handleAdd = () => {
    const { dataSource, count } = this.state;
    const newData = {
      index: count,
      key: `age-${count}`,
      type: 'fix',
      value: '26',
      description: '年龄'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };
  onValueChange = (e, record, key) => {
    let value = e;
    if (e && e.target) {
      value = e.target.value;
    }
    this.changeDataSource(value, record, key);
  };
  changeDataSource = (value, record, key) => {
    const newData = [...this.state.dataSource];
    const index = this.state.dataSource.findIndex(
      (item) => record.index === item.index
    );
    const item = newData[index];
    item[key] = value;
    newData.splice(index, 1, { ...item });
    this.setState({
      dataSource: newData
    });
  };
  methodChange = (value) => {
    this.setState({
      method: value
    });
  };
  requestUrlChange = (e) => {
    this.setState({
      requestUrl: e.target.value
    });
  };
  sendRequest = async () => {
    let url = this.state.requestUrl;
    if (!/^https?:\/\/.*/.test(url)) {
      message.error('请输入正确的请求URL');
      return;
    }
    const result =
      methods['getDataContainerData'] &&
      (await methods['getDataContainerData'](
        this.state.method,
        url,
        this.state.dataSource
      ));
    if (result && result.code == 0) {
      this.setState({
        response: JSON.stringify(result, '', 1)
      });
    }
  };
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <Control {...this.props}>
        <Button size={'small'} onClick={this.openDataBox.bind(this)}>
          使用数据源
        </Button>
        <Modal
          title="数据源"
          visible={this.state.dataBoxVisible}
          onOk={this.ok}
          onCancel={this.cancel}
          width={880}
          height={500}
          style={{ paddingBottom: 0 }}
          okText="确认"
          cancelText="取消"
          className="data-modal"
        >
          <div className="radio-box">
            <span style={{ marginRight: '20px' }}>数据来源：</span>
            <Radio.Group
              defaultValue={this.state.dataOrigin}
              key={this.state.dataOrigin}
              onChange={this.changeDataOrigin.bind(this)}
            >
              <Radio value={'json'}>静态数据</Radio>
              <Radio value={'request'}>接口数据</Radio>
            </Radio.Group>
          </div>
          {this.state.dataOrigin == 'json' && (
            <div>
              <span>json数据：（info下是正经数据）</span>
              <Input.TextArea
                style={{ width: '100%', height: '400px', marginTop: '10px' }}
                placeholder={JSON.stringify(defaultPlaceholder, '', 1)}
                value={this.state.jsonValue}
                onChange={this.changeValue.bind(this)}
              ></Input.TextArea>
            </div>
          )}
          {this.state.dataOrigin == 'request' && (
            <div>
              <Row className="request-setting-box" type="flex" gutter={10}>
                <Col flex="100px" style={{ flex: '0 0 65px' }}>
                  <Select
                    defaultValue={this.state.method}
                    onChange={this.methodChange.bind(this)}
                  >
                    <Select.Option value="GET">GET</Select.Option>
                    <Select.Option value="POST">POST</Select.Option>
                    <Select.Option value="JSONP">JSONP</Select.Option>
                  </Select>
                </Col>
                <Col style={{ flex: '1 1 auto' }}>
                  <Input
                    placeholder="请输入请求URL"
                    value={this.state.requestUrl}
                    onChange={this.requestUrlChange.bind(this)}
                  ></Input>
                </Col>
                <Col style={{ flex: '0 0 65px' }}>
                  <Button type="primary" onClick={this.sendRequest.bind(this)}>
                    发送请求
                  </Button>
                </Col>
              </Row>
              <div className="request-params">
                <div style={{ margin: '20px 0 20px 0' }}>请求参数：</div>
                <Button
                  onClick={this.handleAdd}
                  type="primary"
                  style={{
                    marginBottom: 16
                  }}
                >
                  增加参数
                </Button>
                <Table
                  dataSource={this.state.dataSource}
                  columns={columns}
                  bordered
                  rowKey={() => Math.random()}
                  pagination={false}
                  components={components}
                />
              </div>
              <div style={{ marginTop: '20px' }}>
                <span>响应：</span>
                <Input.TextArea
                  readOnly
                  style={{ width: '100%', height: '200px', marginTop: '10px' }}
                  value={this.state.response}
                ></Input.TextArea>
              </div>
            </div>
          )}
        </Modal>
      </Control>
    );
  }
}
export default DataBox;
