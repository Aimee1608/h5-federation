import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import Control from '../Control';
import { store } from '../../common/pointcut';

const Option = Select.Option;

@observer
class PageStateControl extends React.Component {
  onPageChange = (value, option) => {
    let { attribute, namespace, element } = this.props;
    if (!element.modify) {
      element[attribute] = value;
      element['stateType'] = option.props.type;
    } else {
      element.modify(
          {
            [attribute]: value,
            ['stateType']: option.props.type,
          },
          namespace
      );
    }
  };

  render() {
    let { attribute, namespace, project, element } = this.props;
    let stageStore = store['stageStore']?.getStageStore();
    let projectData = stageStore ? stageStore.getProject() : project;
    let data = namespace ? element[namespace] : element;
    let value = (data.get ? data.get(attribute) : data[attribute]) || undefined;
    const options = [];
    projectData.pageState.forEach((value, key) => {
      options.push({
        name: key,
        type: value.type,
        value: value.value,
      });
    });
    return (
        <Control {...this.props}>
          <Select
              style={{ width: '100%' }}
              placeholder={'选择组件'}
              onChange={this.onPageChange}
              value={value || null}
          >
            <Option value={null} key={-1}>
              {'请选择'}
            </Option>
            {options.map((option, index) => (
                <Option key={index} value={option.name} type={option.type}>
                  {option.name}
                </Option>
            ))}
          </Select>
        </Control>
    );
  }
}
export default PageStateControl;
