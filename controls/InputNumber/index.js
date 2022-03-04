import React from 'react';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react';
import Control from '../Control';
import Base from '../Base';
@observer
class InputNumberControl extends Base {
  onChange = async (value) => {
    value = isNaN(value) ? 0 : value;
    this.modify(value);
  };

  render() {
    const { attribute, namespace, element, step, onlyKey } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    value = isNaN(value) ? 0 : value;
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <InputNumber
          key={
            onlyKey && onlyKey !== 'undefined'
              ? onlyKey
              : attribute + '_InputNumber'
          }
          min={this.props.min}
          max={this.props.max}
          defaultValue={value}
          onChange={this.onChange}
          step={step}
          style={{
            width: '100%'
          }}
        />
      </Control>
    );
  }
}

export default InputNumberControl;
