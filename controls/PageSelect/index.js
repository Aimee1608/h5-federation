import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import Control from '../Control';
import { store } from '../../common/pointcut';

const Option = Select.Option;

@observer
class PageSelect extends React.Component {
  onPageChange = (pageId) => {
    let { attribute, namespace, element } = this.props;

    if (!element.modify) {
      element[attribute] = pageId;
    } else {
      element.modify(
        {
          [attribute]: pageId
        },
        namespace
      );
    }
  };

  render() {
    let { attribute, namespace, element, project, readOnly } = this.props;

    let stageStore = store['stageStore']?.getStageStore();
    let projectData = stageStore ? stageStore.getProject() : project;

    let data = namespace ? element[namespace] : element;
    let value = (data.get ? data.get(attribute) : data[attribute]) || undefined;

    let pageOptions = projectData.pages.map((page) => ({
      name: page.name,
      value: page.id
    }));

    return (
      <Control {...this.props}>
        <Select
          style={{ width: this.props.width || '100%' }}
          placeholder={'选择组件'}
          onChange={this.onPageChange}
          value={value || null}
          disabled={readOnly}
        >
          <Option value={null}>{'请选择'}</Option>
          {pageOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.name}
            </Option>
          ))}
        </Select>
      </Control>
    );
  }
}
export default PageSelect;
