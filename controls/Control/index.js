import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col, Icon, Button, Tooltip } from 'antd';
import { hasVariable } from 'common/utils';
import './index.less';
import { methods, components, store } from '../../common/pointcut';
import classNames from 'classnames';
const controlTitleStyle = {
  lineHeight: '32px',
  color: '#333'
};

@observer
class Control extends React.Component {
  showVariablePicker = () => {
    let { attribute, namespace, element, project, space, widget } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    let path =
      space == 'trigger' || space == 'assemble' ? widget.path : element.path;
    element.clazz === 'project' && (path = element.getSelectedPage().id);
    element.clazz === 'share' && (path = project.getSelectedPage().id);
    let widgetData = methods['getWidgetVariable'](path);
    // 展示变量转选择富文本
    this.variablePicker.show(
      value,
      widgetData,
      async function (params) {
        // pageState 都通过变量修改器修改
        if (!element.modify) {
          element[attribute] = params.content;
        } else {
          await element.modify(
            {
              [attribute]: params.content
            },
            namespace
          );
        }
      },
      path
    );
  };
  render() {
    let me = this;
    let props = this.props;

    let {
      attribute,
      namespace,
      useData,
      // 元素  page, widget, trigger, animation
      element,
      project
    } = props;
    let stageStore = store['stageStore']?.getStageStore();
    let projectData = stageStore ? stageStore.getProject() : project;
    let textWidth = 6;
    let contentWidth = 16;

    let text = this.props.text;
    let msg = this.props.msg;
    let children = this.props.children;

    let useToolbar = false;
    // 只有知道当前控件的类型，才知道用什么类型的变量选择器
    let controlType = props.type;
    if (controlType == 'RichText') {
      useToolbar = true;
    }

    let onRemoveVariable = async function () {
      if (namespace) {
        element[namespace][attribute] = '';
      } else {
        element[attribute] = '';
      }
    };
    const value = namespace
      ? element[namespace][attribute]
      : element[attribute];
    const isPageVariable = hasVariable(value);
    let pageVariableName = '未指派';
    if (isPageVariable) {
      pageVariableName = value;
    }
    const VariablePicker = components['VariablePicker'];

    return (
      <div
        className={classNames([
          'control',
          (this.props.parentAttribute ? this.props.parentAttribute + '-' : '') +
            this.props.attribute +
            '-control'
        ])}
      >
        <Row>
          {this.props.require ? (
            <span className="control-require">*</span>
          ) : null}
          {text && (
            <Col
              className="control-text"
              span={textWidth}
              title={text}
              style={controlTitleStyle}
            >
              {msg ? (
                <Tooltip placement="topLeft" title={msg} arrowPointAtCenter>
                  {text}
                  <Icon
                    type="question-circle-o"
                    style={{ marginLeft: '3px' }}
                  />
                </Tooltip>
              ) : (
                text
              )}
            </Col>
          )}
          <Col span={contentWidth}>
            {(!useData || (useData && !isPageVariable)) && children}
            {this.props.validateRes && !this.props.validateRes.stat ? (
              <p className="validate-tip">
                <Icon type="exclamation-circle" />
                &nbsp;{this.props.validateRes.msg}
              </p>
            ) : null}
            {useData &&
              projectData.useData &&
              isPageVariable &&
              pageVariableName && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '28px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    icon="database"
                    title={value.text}
                    type="primary"
                    style={{
                      marginRight: 10,
                      maxWidth: 180,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                    onClick={me.showVariablePicker}
                  >
                    {pageVariableName}
                  </Button>
                  <Button
                    icon="close"
                    type="ghost"
                    title={'解除数据绑定'}
                    style={{ border: 'none' }}
                    onClick={onRemoveVariable}
                  />
                </div>
              )}
          </Col>
          {useData && projectData.useData && (
            <Col span={2}>
              <Tooltip
                title="使用接口返回的数据或者页面变量"
                placement="topRight"
              >
                <Icon
                  type="codepen"
                  onClick={me.showVariablePicker}
                  className="code"
                />
              </Tooltip>
              {VariablePicker && (
                <VariablePicker
                  useToolbar={useToolbar}
                  project={projectData}
                  ref={(node) => {
                    me.variablePicker = node;
                  }}
                />
              )}
            </Col>
          )}
        </Row>
      </div>
    );
  }
}

export default Control;
