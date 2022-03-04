import React from 'react';
import { observer } from 'mobx-react';
import { Select } from 'antd';
import Control from '../Control';
import { store } from '../../common/pointcut';


const Option = Select.Option;

@observer
class PageStateTypeControl extends React.Component {
  render() {
    let { element, project } = this.props;
    const { data } = element;
    let stageStore = store['stageStore']?.getStageStore();
    let projectData = stageStore ? stageStore.getProject() : project;
    let stageType = null;
    projectData && projectData.pageState.forEach((value, key) => {
      if (data.target == key) {
        stageType = value.type;
      }
    });
    return (
        <Control {...this.props}>
          <Select
              style={{ width: '100%' }}
              placeholder={'选择组件'}
              value={stageType || null}
              disabled={true}
          >
            <Option value={stageType} key={-1}>
              {stageType}
            </Option>
          </Select>
        </Control>
    );
  }
}
export default PageStateTypeControl;
