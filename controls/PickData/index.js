import { observer } from 'mobx-react';
import Control from '../Control';
import './index.less';
import React from 'react';
import { Button } from 'antd';
import { methods, components, store } from '../../common/pointcut';
@observer
class PickData extends React.Component {
  constructor(props) {
    super(props);
  }
  showVariablePicker = () => {
    let { attribute, namespace, element } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    // 展示变量转选择富文本
    this.variablePicker &&
      this.variablePicker.show(
        value,
        element.data.dataSource
          ? element.data.dataModel.responseData.data || {}
          : methods['getWidgetVariable'](element.path),
        async function (params) {
          // pageState 都通过变量修改器修改 /\$\{(\w+)\.(\w*(\$\$)*)\w*\}/g
          // 这里不确定中间是两个还是三个，兼容一下吧
          const PAGE_STATE_VAR_TAG = /(?<=\$\{)(\w+)\.(\w+)(?=\})/g;
          const PROJECT_VARIABLE = /(?<=\$\{)(\w+)\.(\w+)\.(\w+)(?=\})/g;
          if (params && params.content) {
            await element.modify(
              {
                [attribute]: (params.content.match(PAGE_STATE_VAR_TAG) ||
                  params.content.match(PROJECT_VARIABLE))[0]
              },
              namespace
            );
          }
        },
        element.path
      );
  };
  onRemoveValue = async () => {
    let { attribute, namespace, element } = this.props;
    await element.modify(
      {
        [attribute]: ''
      },
      namespace
    );
  };
  render() {
    let { attribute, namespace, project, element } = this.props;
    let stageStore = store['stageStore']?.getStageStore();
    let projectData = stageStore ? stageStore.getProject() : project;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    const VariablePicker = components['VariablePicker'];
    return (
      <Control {...this.props}>
        <Button
          size={'small'}
          type={value ? 'primary' : ''}
          onClick={this.showVariablePicker.bind(this)}
        >
          {value ? value : '变量选择'}
        </Button>
        {value && (
          <Button
            icon="close"
            type="ghost"
            title={'解除数据绑定'}
            style={{ border: 'none' }}
            onClick={this.onRemoveValue.bind(this)}
          />
        )}
        {VariablePicker && (
          <VariablePicker
            project={projectData}
            ref={(node) => {
              this.variablePicker = node;
            }}
          />
        )}
      </Control>
    );
  }
}
export default PickData;
