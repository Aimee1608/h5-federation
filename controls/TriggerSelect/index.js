import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Select } from 'antd';
import Controls from 'controls';
import Control from '../Control';
import { methods, configs, store } from '../../common/pointcut';
import './index.less';
import uniqBy from 'lodash/uniqBy';

@observer
class TriggerSelectControl extends React.Component {
  state = {
    controls: [],
    isLoaded: false
  };
  // 获取当前页面内使用的组件
  getUsedComponents(type) {
    let stageStore = store['stageStore']?.getStageStore();
    let components = stageStore ? stageStore.getUsedComponents() || {} : {};
    let version = '';
    Object.keys(components).forEach((key) => {
      if (type == key) {
        version = components[key];
      }
    });
    return version;
  }

  onChange = async (value) => {
    const Trigger = store['clazzTrigger'];
    let { attribute, namespace, element } = this.props;
    let version = methods['getUsedTriggerVersion'](value);
    this.setState({
      isLoaded: false
    });
    if (value != 'none') {
      let triggerDefine = methods['getTriggerConfigByType'](value, version);
      if (!triggerDefine || !triggerDefine.isLoaded) {
        triggerDefine = await methods['loadTriggerConfig']({
          type: value,
          version: version
        });
      }
      if (element.modify && typeof element.modify == 'function') {
        element.modify(
          {
            [attribute]: value
          },
          namespace
        );
        element[attribute] = new Trigger(triggerDefine, null);
      } else if (element.clazz && /trigger|widget/.test(element.clazz)) {
        element[attribute] = new Trigger(triggerDefine, null);
      } else {
        element[attribute] = value;
        element[`${attribute}-trigger`] = new Trigger(triggerDefine, null);
      }
    } else {
      if (element.modify && typeof element.modify == 'function') {
        element.modify(
          {
            [attribute]: 'none'
          },
          namespace
        );
      }
      // 不是trigger
      if (!element.clazz || /trigger|widget/.test(element.clazz)) {
        element[`${attribute}-trigger`] = 'none';
      } else {
        element[attribute] = 'none';
      }
    }
    this.setState({
      isLoaded: true
    });
  };

  getTriggerConfig = () => {
    const Trigger = store['clazzTrigger'];
    let { attribute, element, project, widget } = this.props;
    let controls = [];
    // 当选择嵌套执行的trigger时
    if (this.state.isLoaded) {
      // AssembleList里面的element是自己每一项的数据不属于Trigger
      let trigger =
        element instanceof Trigger ||
        (element && /trigger|widget/.test(element.clazz))
          ? element[attribute]
          : element[`${attribute}-trigger`];
      let triggerDefine = methods['getTriggerConfigByType'](
        trigger.type,
        trigger.version
      );
      if (triggerDefine) {
        let triggerConfig = triggerDefine['config'] || {};
        const _widget = element instanceof Trigger ? widget : element;
        Object.keys(triggerConfig).forEach(function (key) {
          let controlConfig = triggerConfig && triggerConfig[key];
          if (controlConfig) {
            let Control = Controls[controlConfig.type];
            if (
              (controlConfig.when &&
                controlConfig.when(trigger, element, project)) ||
              !controlConfig.when
            ) {
              let newControlConfig = {};
              // 遍历controlConfig的值，如果是一个对象，得执行该对象
              Object.keys(controlConfig).forEach((controlkey) => {
                // filter暂时不能去除，领取优惠券组件在使用的
                if (
                  typeof controlConfig[controlkey] == 'function' &&
                  !/^(when|filter|checkError|validate)$/.test(controlkey)
                ) {
                  newControlConfig[controlkey] = controlConfig[controlkey](
                    trigger,
                    element,
                    toJS(project)
                  );
                } else {
                  newControlConfig[controlkey] = controlConfig[controlkey];
                }
              });
              controls.push(
                <Control
                  project={project}
                  key={`${trigger.id}-${key}`}
                  element={trigger}
                  namespace="data"
                  attribute={key}
                  space="trigger"
                  widget={_widget}
                  readOnly={newControlConfig.readOnly}
                  {...newControlConfig}
                />
              );
            }
          }
        });
      }
    }
    return controls;
  };

  getActions() {
    const { type } = this.props;
    let newTriggerConfigs = [];
    // 只在页面添加行为时展示分享
    configs['TriggerConfigs'].map((triggerConfig) => {
      // showCondition没有，则说明都展示
      if (!triggerConfig.showCondition) {
        newTriggerConfigs.push({
          text: triggerConfig.name,
          value: triggerConfig.type
        });
      } else {
        triggerConfig.showCondition.map((condition) => {
          if (type == condition) {
            newTriggerConfigs.push({
              text: triggerConfig.name,
              value: triggerConfig.type
            });
          }
        });
      }
    });
    return uniqBy(newTriggerConfigs, 'value');
  }

  async UNSAFE_componentWillMount() {
    const Trigger = store['clazzTrigger'];
    let { attribute, namespace, element } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = (data.get ? data.get(attribute) : data[attribute]) || 'none';
    let version = this.getUsedComponents(value);
    if (value != 'none') {
      let triggerDefine = methods['getTriggerConfigByType'](value, version);
      if (!triggerDefine || !triggerDefine.isLoaded || !triggerDefine.config) {
        await methods['loadTriggerConfig']({
          type: value,
          version: version
        });
      }
      if (element.modify && typeof element.modify == 'function') {
        element[attribute] = new Trigger(element[attribute], null);
      } else if (element && /trigger|widget/.test(element.clazz)) {
        element[attribute] = new Trigger(element[attribute], null);
      } else {
        element[`${attribute}-trigger`] = new Trigger(
          element[`${attribute}-trigger`],
          null
        );
      }
    } else {
      element[attribute] = 'none';
    }
    this.setState({
      isLoaded: true
    });
  }
  render() {
    let { attribute, namespace, element, initValue } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = (data.get ? data.get(attribute) : data[attribute]) || 'none';
    let options = this.getActions().map(function (option, index) {
      return (
        <Select.Option key={index} value={option.value}>
          {option.text}
        </Select.Option>
      );
    });
    options.unshift(
      <Select.Option key={-1} value="none">
        无
      </Select.Option>
    );

    return (
      <div className="trigger-callback">
        <Control {...this.props}>
          <Select
            style={{ width: this.props.width || '100%' }}
            placeholder={this.props.placeholder}
            onChange={this.onChange}
            value={value || initValue}
            showSearch
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
          >
            {options}
          </Select>
        </Control>
        {value != 'none' && this.getTriggerConfig()}
      </div>
    );
  }
}
export default TriggerSelectControl;
