import React from 'react';
import { observer } from 'mobx-react';
import { Slider, InputNumber, Row, Col } from 'antd';
import Base from '../Base';
import Control from '../Control';
import './index.less';

const isValid = (value) => {
  return !isNaN(value) && value !== '' && value !== null;
};

@observer
class SliderControl extends Base {
  onChange = async value => {
    value = parseFloat(value);
    value = isNaN(value) ? 0 : value;
    // Base 中的modify
    this.modify(value);
  }
  render() {
    let {
      attribute,
      namespace,
      element,
      step,
      readOnly
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    if (!/^\d*(\.(5|0))?$/.test(value)) {
      value = parseInt(value, 10);
    }
    // value = isNaN(value) ? 0 : value;
    // namespace === 'data'时，value为组件中定义数据，默认值优先级data>config>0
    if (namespace === 'data') {
      const currentConf = element.config && element.config[attribute] || {};
      value = isValid(value) ?
        value :
        isValid(currentConf.value) ?
          currentConf.value :
          0;
    } else {
      value = isNaN(value) ? 0 : value;
    }
    return (
      <Control {...this.props}>
        <Row ref={this.myRef}>
          <Col span={16}>
            <Slider
              className='editor-slider'
              min={this.props.min}
              max={this.props.max}
              onChange={this.onChange}
              value={value}
              step={step}
              disabled={readOnly}
            />
          </Col>
          <Col span={6}>
            <InputNumber
              min={this.props.min}
              max={this.props.max}
              value={value}
              defaultValue={value}
              onChange={this.onChange}
              step={step}
              disabled={readOnly}
              style={{
                width: '60px',
                marginLeft: '8px'
              }}
            />
          </Col>
        </Row>
      </Control>
    );
  }
}

export default SliderControl;
