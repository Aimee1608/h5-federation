import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import Control from '../Control';
import Base from '../Base';
import { store } from '../../common/pointcut';
const Option = Select.Option;

@observer
class CurrentPageWidgetSelect extends Base {
  onWidgetChange = (widgetId) => {
    this.modify(widgetId);
  };

  render() {
    let { attribute, namespace, element, project } = this.props;
    let stageStore = store['stageStore']?.getStageStore();
    let projectData = stageStore ? stageStore.getProject() : project;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    let selectedWidgetId;
    let widgetOptions = projectData
      .getSelectedPage()
      .widgets.map(function (widget) {
        if (widget.id == value) {
          selectedWidgetId = value;
        }

        return (
          <Option key={widget.id} value={widget.id}>
            {widget.name}
          </Option>
        );
      });

    selectedWidgetId = selectedWidgetId || '0';
    return (
      <Control {...this.props}>
        <Select
          style={{ width: 80, marginLeft: 10 }}
          placeholder={'选择组件'}
          onChange={this.onWidgetChange}
          value={selectedWidgetId}
        >
          <Option key={'0'} value={'0'}>
            {'请选择'}
          </Option>
          {widgetOptions}
        </Select>
      </Control>
    );
  }
}
export default CurrentPageWidgetSelect;
