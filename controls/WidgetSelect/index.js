import React from 'react';
import { observer } from 'mobx-react';
import { TreeSelect } from 'antd';
import Control from '../Control';
import Base from '../Base';

@observer
class WidgetSelectControl extends Base {
  changeOption = (value) => {
    this.modify(value);
  };
  getSelectType = (component, widgetType) => {
    return component.widgets.filter((item) => {
      if (item.type == widgetType) {
        return true;
      } else {
        if (item.layers.length) {
          return item.layers.filter((laryer) => {
            return this.getSelectType(laryer, widgetType);
          });
        }
      }
    });
  };
  getOptions = (component, idChain = component._id, lastComponent) => {
    let me = this;
    let { widgetType, filter } = this.props;
    if (filter && !filter(component, lastComponent)) {
      return false;
    }
    let children;
    if (component.pages) {
      children = component.pages;
      idChain = '';
    } else if (component.widgets) {
      if (widgetType) {
        children = component.widgets.filter((item) => {
          return item.type == widgetType || item.hasLayers;
        });
      } else {
        children = component.widgets;
      }
    } else if (component.layers) {
      children = component.layers;
    }
    let newIdChildren = idChain ? idChain + '-' : '';
    if (children && children.length) {
      let options = children.map((child) => {
        let getChild = me.getOptions(
          child,
          newIdChildren + child.id,
          component
        );
        if (getChild != false) {
          return {
            title: child.name,
            value: newIdChildren + child.id,
            key: child.id,
            type: child.type,
            children: getChild
          };
        } else {
          return false;
        }
      });
      options = options.filter((item) => item != false);
      if (options.length) {
        return options;
      }
      return null;
    }
    return null;
  };
  checkValue(treeData, arr, index) {
    if (!treeData) return false;
    let value = arr[index];
    if (index < arr.length) {
      return treeData.some((item) => {
        if (item.key == value) {
          if (!item.children && index == arr.length - 1) {
            return true;
          }
          return this.checkValue(item.children, arr, ++index);
        }
      });
    }
    return true;
  }
  render() {
    let me = this;
    let { project, attribute, namespace, element, readOnly } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    let treeData = me.getOptions(project);
    value = me.checkValue(treeData, (value || '').split('-'), 0) ? value : '';
    return (
      <Control {...this.props}>
        <TreeSelect
          style={{ width: '100%' }}
          value={value || undefined}
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: 236, maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          disabled={readOnly}
          placeholder={'请选择'}
          treeDefaultExpandAll
          onChange={this.changeOption}
        />
      </Control>
    );
  }
}
export default WidgetSelectControl;
