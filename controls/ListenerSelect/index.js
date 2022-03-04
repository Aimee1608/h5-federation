import React from 'react';
import {observable} from 'mobx';
import { observer } from 'mobx-react';
import { TreeSelect, Select } from 'antd';
import Control from '../Control';
import Controls from 'controls';
import { methods } from "../../common/pointcut";

@observer
class ListenerSelectControl extends React.Component {
  @observable widgetId = null
  @observable listenerId = null
  @observable listenerOptions = []
  changeTriggerData = (widgetId, listenerId) => {
    let {
      attribute,
      namespace,
      element
    } = this.props;
    if (!element.modify) {
      element['widgetId'] = widgetId;
      element[attribute] = listenerId;
    }
    else {
      element.modify({
        widgetId: widgetId,
        [attribute]: listenerId
      }, namespace);
    }
  }
  changeWidget = widgetId => {
    this.widgetId = widgetId;
    this.changeTriggerData(widgetId, null);
    this.getListeners();
  }
  changeListener = listenerId => {
    this.listenerId = listenerId;
    this.changeTriggerData(this.widgetId, listenerId);
  }
  getListeners = (widgetId) => {
    let widget = methods['getWidget'] && methods['getWidget'](widgetId);
    if (widget && widget.listeners) {
      let listenerOptions = [];
      Object.keys(widget.listeners).forEach(key => {
        listenerOptions.push({
          name: widget.listeners[key].name,
          value: key
        });
      });
      return listenerOptions;
    }
  }
  getOptions = (component, idChain = component._id) => {
    let me = this;
    let children;
    if (component.pages) {
      children = component.pages;
      idChain = '';
    }
    else if (component.widgets) {
      children = component.widgets;
    }
    else if (component.layers) {
      children = component.layers;
    }
    let newIdChildren = idChain ? (idChain + '-') : '';
    if (children && children.length) {
      let options = children.map(child => {
        return {
          title: child.name,
          value: newIdChildren + child.id,
          key: newIdChildren + child.id,
          children: me.getOptions(child, newIdChildren + child.id)
        };
      });
      return options;
    }
    return null;
  }
  getConfigControl(widgetId, listenerId) {
    let controls = [];
    let widget = methods['getWidget'] && methods['getWidget'](widgetId);
    let {
      project,
      element
    } = this.props;
    let ListenerConfig = methods['getListenerConfig'] && methods['getListenerConfig'](widgetId, listenerId);
    if(ListenerConfig && widget && widget.listeners) {
      for (let pro of Object.keys(ListenerConfig)) {
        let field = ListenerConfig[pro];
        let Control = Controls[field.type];
        if (
          Control &&
          (
            (field.when && field.when(element, project)) ||
            !field.when
          )
        ) {
          controls.push(
            <Control
              project={project}
              key={`${element.id}_${pro}`}
              element={element}
              namespace={'data'}
              attribute={pro}
              {...field}
            />
          );
        }
      }
    }
    if (controls.length) {
      return controls;
    }
    return null;
  }
  render() {
    let me = this;
    let {
      project,
      attribute,
      namespace,
      element
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let listenersId = data.get ? data.get(attribute) : data[attribute];
    let widgetId = data.get ? data.get('widgetId') : data['widgetId'];
    let options = [];
    options = me.getListeners(widgetId);
    let treeData = me.getOptions(project);
    return (
      <div>
        <Control {...this.props} text={'选择组件'}>
          <TreeSelect
            style={{ width: '100%' }}
            value={widgetId || undefined}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 236, maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder={'请选择组件'}
            treeDefaultExpandAll
            onChange={this.changeWidget}
          />
        </Control>
        {
          widgetId ? (
            <div>
              <Control {...this.props} text={'选择监听器'}>
                <Select style={{ width: '100%' }} value={listenersId || undefined} placeholder={'选择监听器'} onChange={this.changeListener}>
                  {options && options.map((item, index) => (
                    <Select.Option key={index} value={item.value}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Control>
              <div>
                {this.getConfigControl(widgetId, listenersId)}
              </div>
            </div>
          ) : null
        }
      </div>

    );
  }
}
export default ListenerSelectControl;
