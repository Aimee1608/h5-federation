import React from 'react';
import { observer } from 'mobx-react';
import { Radio } from 'antd';
import Control from '../Control';
import Base from '../Base';
import './index.less';
import { methods } from '../../common/pointcut';

@observer
class RadioButtonControl extends Base {
  onChange = async (e) => {
    this.modify(e.target.value);
    methods['afterUpdateHook'] &&
      methods['afterUpdateHook'](
        this.props.element,
        'width',
        null,
        'hasLayers'
      );
  };

  render() {
    let { attribute, namespace, element, readOnly } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    let options = (this.props.options || []).map(function (option, index) {
      return (
        <Radio.Button key={index} value={option.value} disabled={readOnly}>
          {option.text}
        </Radio.Button>
      );
    });
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <Radio.Group onChange={this.onChange} value={value}>
          {options}
        </Radio.Group>
      </Control>
    );
  }
}
export default RadioButtonControl;
