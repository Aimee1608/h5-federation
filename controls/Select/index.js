import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import Control from '../Control';
import Base from '../Base';
const Option = Select.Option;
import { methods } from '../../common/pointcut';

@observer
class SelectControl extends Base {
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
  render() {
    let {
      attribute,
      depAttr,
      namespace,
      element,
      initValue,
      showSearch = false,
      dropdownRenderConfig = {},
      readOnly
    } = this.props;

    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];

    if (depAttr && !this.props.options.find((v) => v.value === value)) {
      value = '';
    }

    let options = this.props.options.map(function (option, index) {
      return (
        <Option key={index} value={option.value}>
          {option.text}
        </Option>
      );
    });
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <Select
          style={{ width: this.props.width || '100%' }}
          placeholder={this.props.placeholder || '请选择'}
          onChange={this.onChange}
          value={value || initValue}
          showSearch={showSearch}
          optionFilterProp="children"
          filterOption={(input, option) => {
            return (
              option &&
              option.props &&
              option.props.children &&
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
          {...dropdownRenderConfig}
          disabled={readOnly}
        >
          {options}
        </Select>
      </Control>
    );
  }
}
export default SelectControl;
