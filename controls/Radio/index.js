import React from 'react';
import { observer } from 'mobx-react';
import { Radio } from 'antd';
import Control from '../Control';
import Base from '../Base';
const RadioGroup = Radio.Group;
import './index.less';
@observer
class RadioControl extends Base {

  onChange = async e => {
    this.modify(e.target.value)
  }
  render() {
    let {
      attribute,
      namespace,
      element,
      readOnly
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    let options = this.props.options.map(function (option, index) {
      return (
          <Radio key={index} value={option.value} disabled={readOnly}>{option.text}</Radio>
      );
    });
    return (
        <Control {...this.props} validateRes={this.state.validateRes}>
          <div className="editor-radio-group">
            <RadioGroup onChange={this.onChange} value={value} size='small'>
              {options}
            </RadioGroup>
          </div>
        </Control>
    );
  }
}
export default RadioControl;
