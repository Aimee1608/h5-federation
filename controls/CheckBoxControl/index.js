import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';
import Control from '../Control';
import Base from '../Base';
import '../CheckBox/index.less';

@observer
class CheckBoxControl extends Base {

  render() {
    let { attribute, element } = this.props;

    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <Checkbox
          onChange={this.props.onChange}
          checked={element[attribute]}
        />
      </Control>
    );
  }
}
export default CheckBoxControl;
