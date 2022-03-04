import './index.less';
import React from 'react';
import { observer } from 'mobx-react';
import { InputNumber, Row } from 'antd';
import Control from '../Control';
import Base from '../Base';
@observer
class MarginControl extends Base {

  onChange = async (value, index) => {
    let {
      attribute,
      namespace,
      element
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let originvalue = data.get ? data.get(attribute) : data[attribute];
    let nums = originvalue.split(' ');

    nums[index] = value || 0;
    // zhangyan 这里需要仔细考虑，文本获取内容实际高度，需要提前确定其是自动调整高度并修改其padding值，不优雅
    if (attribute == 'padding' && element.type === 'RichText' && element.data && element.data.autoHeight) {
      element[attribute] = nums.join(' ')
    } else {
      this.modify(nums.join(' '))
    }
  }
  render() {
    let {
      attribute,
      namespace,
      element
    } = this.props;

    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];

    let nums = value.split(' ');

    return (
      <Control {...this.props}>
        <Row>
          <div style={{ display: 'block' }}>
            <div className="align-name">{'上'}</div>
            <InputNumber
              max={1000}
              value={nums[0]}
              onChange={e => { this.onChange(e, 0); }}
              placeholder={'上'}
              style={{
                width: '60px',
                marginRight: '5px'
              }}
            />
            <div className="align-name">{'下'}</div>
            <InputNumber
              max={1000}
              value={nums[2]}
              onChange={e => { this.onChange(e, 2); }}
              placeholder={'下'}
              style={{
                width: '60px'
              }}
            />
          </div>
          <div style={{ display: 'block' }}>
            <div className="align-name">{'左'}</div>
            <InputNumber
              max={1000}
              value={nums[3]}
              onChange={e => { this.onChange(e, 3); }}
              placeholder={'左'}
              style={{
                width: '60px',
                marginRight: '5px'
              }}
            />
            <div className="align-name">{'右'}</div>
            <InputNumber
              max={1000}
              value={nums[1]}
              onChange={e => { this.onChange(e, 1); }}
              placeholder={'右'}
              style={{
                width: '60px',
              }}
            />
          </div>

        </Row>
      </Control>
    );
  }
}

export default MarginControl;
