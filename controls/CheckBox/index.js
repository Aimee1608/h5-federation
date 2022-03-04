import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';
import Control from '../Control';
import Base from '../Base';
import './index.less';

const CheckboxGroup = Checkbox.Group;

@observer
class CheckBoxControl extends Base {
  onChange = async (checked) => {
    this.modify(checked);
  };

  render() {
    let { attribute, namespace, element, readOnly } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    value = value || [];
    let options = this.props.options
      .map(function (option, index) {
        return (
          <Checkbox key={index} value={option.value}>
            {option.text}
          </Checkbox>
        );
      })
      .slice();
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <CheckboxGroup
          onChange={this.onChange}
          value={value.slice()}
          disabled={readOnly}
        >
          {options}
        </CheckboxGroup>
      </Control>
    );
  }
}
export default CheckBoxControl;
