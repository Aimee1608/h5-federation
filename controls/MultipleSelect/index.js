import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Select } from 'antd';
import Control from '../Control';
import Base from '../Base';
const Option = Select.Option;
import { methods } from '../../common/pointcut';

@observer
class MultipleSelectControl extends Base {
  state = {
    ...this.state,
    options: []
  };

  onChange = async (value) => {
    this.modify(value, this.props.onChange);
  };

  async UNSAFE_componentWillMount() {
    // 通过 url 动态获取control的配置
    if (this.props['apiConfig']) {
      let apiConfig = this.props['apiConfig'];
      let url = apiConfig['url'];
      let params;
      if (apiConfig['canche']) {
        apiConfig['params']['_canche'] = true;
      }
      params = apiConfig['params'];
      let method = apiConfig['methods'].toLowerCase();
      let options = methods['getOptionByApi']
        ? await methods['getOptionByApi'](
            method,
            url,
            params,
            this.props.filter
          )
        : [];
      this.setState({
        options: options
      });
    }
  }
  hasValue(value) {
    return value && value !== '';
  }

  render() {
    let { attribute, namespace, element, initValue, readOnly } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    let optionInit = this.props['apiConfig']
      ? this.state.options
      : this.props.options;
    let options = (optionInit || []).map(function (option, index) {
      return (
        <Option key={index} value={option.value}>
          {option.text}
        </Option>
      );
    });
    let editable = this.props.editable ? 'tags' : 'multiple';
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <Select
          style={{ width: this.props.width || '100%' }}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          value={this.hasValue(value) ? toJS(value) : initValue}
          mode={editable}
          disabled={readOnly}
        >
          {options}
        </Select>
      </Control>
    );
  }
}
export default MultipleSelectControl;
