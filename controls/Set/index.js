import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'antd';
import Control from '../Control';
import { components, methods } from '../../common/pointcut';
import {
  checkTypeToName,
  checkTypeToString,
  checkValueByType
} from 'common/checkType';
import Base from "../Base";
@observer
class SetControl extends Base {
  state = {
    dataSource: []
  };
  showSetEditor = () => {
    let { attribute, namespace, element } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    const me = this;
    this.setEditor.show(
      this.handleDataSource(value || {}),
      async function (data) {
        const setValue = me.convertToMap(data);
        me.modify(setValue)
      }
    );
  };
  convertToMap = (list) => {
    let map = {};
    list.forEach((item) => {
      const key = item['key'];
      const originType = item['originType'];
      const value = checkValueByType(item['value'], originType);
      map[key] = {
        type: originType,
        value: value
      };
    });
    return map;
  };
  handleDataSource(value) {
    let dataSource = [];
    for (let key of Object.keys(value || {})) {
      let originType = checkTypeToString(value[key]['type']) || 'String';
      let type = checkTypeToName(originType);
      dataSource.push({
        key: key,
        type: type,
        originType: originType,
        value:
          value[key].hasOwnProperty('value') &&
          typeof value[key]['value'] != String
            ? value[key]['value'].toString()
            : value[key]
      });
    }
    return dataSource;
  }
  UNSAFE_componentWillMount() {
    let { attribute, namespace, element } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    const dataSource = this.handleDataSource(value);
    const set = this.convertToMap(dataSource);
    if (!element.modify) {
      element[attribute] = set;
    } else {
      element.modify(
        {
          [attribute]: set
        },
        namespace
      );
    }
  }
  render() {
    let { attribute, namespace, element, readOnly } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    value = value || {};
    let dataSource = this.handleDataSource(value);
    let columns = [
      {
        title: '键',
        dataIndex: 'key',
        key: 'key'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '值',
        dataIndex: 'value',
        render: (text) => (
          <div title={text} style={{ maxWidth: '70px' }}>
            {text}
          </div>
        )
      }
    ];
    const SetEditor = components['SetEditor'];
    return (
      <Control {...this.props}>
        <Table
          dataSource={dataSource}
          columns={columns}
          size={'small'}
          bordered={true}
          pagination={false}
        />
        {!readOnly && (
          <Button
            onClick={this.showSetEditor}
            style={{ marginTop: 10, width: '100%' }}
          >
            编辑数据
          </Button>
        )}
        {SetEditor && (
          <SetEditor
            {...this.props}
            ref={(node) => {
              this.setEditor = node;
            }}
          />
        )}
      </Control>
    );
  }
}

export default SetControl;
