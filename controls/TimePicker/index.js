import React from 'react';
import { observer } from 'mobx-react';
import { DatePicker } from 'antd';
import Control from '../Control';
import Moment from 'moment';
import Base from '../Base';

@observer
class TimePickerControl extends Base {

  UNSAFE_componentWillMount() {
    const value = this.getValue() || Date.now();
    this.setValue(Moment(value));
  }
  getValue() {
    let { attribute, namespace, element } = this.props;
    let data = namespace ? element[namespace] : element;
    return (data.get ? data.get(attribute) : data[attribute]) || undefined;
  }
  setValue = value => {
    this.modify(Moment(value, 'YYYY-MM-DD HH:mm:ss').valueOf());
  }

  render() {
    const value = this.getValue();
    const { readOnly } = this.props;
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <DatePicker
          showTime
          format='YYYY-MM-DD HH:mm:ss'
          placeholder={this.props.placeholder || '选择时间'}
          onChange={this.setValue}
          defaultValue={Moment(value || Date.now())}
          onBlur={this.validate}
          disabled={readOnly}
          style={{
            width: '100%'
          }}
        />
      </Control>
    );
  }
}
export default TimePickerControl;
