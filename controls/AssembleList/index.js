import './index.less';
import React from 'react';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import uid from 'uid';
import { Button, Icon, message } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { components, store } from '../../common/pointcut';

// 用来给 组件的声明周期方法 使用的
const CALLBACK_UTILS = {
  success: message.success,
  error: message.error,
  info: message.info,
  warning: message.warning,
  loading: message.loading
};

@observer
class AssembleList extends React.Component {
  @observable list = [];
  listCopy = [];
  controlArr = [];
  controlWrapRef = [];
  constructor(props) {
    super(props);
    const { element, namespace, attribute } = this.props;
    // 由于this.list和element[namespace][attribute]不持有相同的引用，所以在最底层组件对element进行修改时并不能同步
    // 这里添加listCopy持有最上层的引用，保证修改的都是同一对象
    if (namespace) {
      this.list = element[namespace][attribute]; // 渲染列表用
      this.listCopy = element[namespace][attribute]; // 传参改变值用
    } else {
      this.list = element[attribute]; // 渲染列表用
      this.listCopy = element[attribute]; // 传参改变值用
    }
  }

  @action removeItem = (index) => {
    const { methods, element } = this.props;
    let execute = true;
    if (methods && typeof methods.onRemoveItem === 'function') {
      execute = methods.onRemoveItem(element.data, CALLBACK_UTILS);
    }
    if (execute) {
      this.list.splice(index, 1);
      this.listCopy.splice(index, 1);
      console.log('removeItem---this.listCopy--', this.listCopy);
      this.controlArr.splice(index, 1);
      if (element.hasLayers) {
        element.removeLayer(index);
      }
    }
  };

  @action addItem = (event, itemData) => {
    const { methods, element, fields } = this.props;
    let execute = true;
    if (methods && typeof methods.onAddItem === 'function') {
      execute = methods.onAddItem(element.data, CALLBACK_UTILS);
    }
    if (execute) {
      const item = itemData || this.getDefaultItemData(fields);
      this.list.push(item);
      this.listCopy.push(item);
      console.log('addItem---this.listCopy--', this.listCopy);
      if (element.hasLayers) {
        element.addLayer();
      }
    }
  };

  getDefaultItemData = (fields = {}) => {
    const item = { keyId: uid(8) };
    Object.keys(fields).forEach((key) => {
      item[key] =
        fields[key].type === 'AssembleList'
          ? [this.getDefaultItemData(fields[key].fields)]
          : fields[key].value;
    });
    return item;
  };
  getItemControls = (index, panel) => {
    const { fields, project, element, require, widget, attribute, showPro } =
      this.props;
    // TODO widget参数是否需要传待验证
    let _widget = {};
    if (store['clazzTrigger']) {
      _widget = element instanceof store['clazzTrigger'] ? widget : element;
    } else {
      _widget = element;
    }
    if (require) {
      this.controlArr[index] = {};
    }
    const ControlWrap = components['ControlWrap'];
    return (
      <ControlWrap
        showPro={showPro}
        key={panel.keyId}
        onlyKey={panel.keyId}
        WidgetConfig={fields}
        project={project}
        element={element}
        attribute={attribute}
        assembleList={this.listCopy}
        index={index}
        space="assemble"
        widget={_widget}
        ref={(node) => (this.controlWrapRef[index] = node)}
      ></ControlWrap>
    );
  };

  // 选项校验
  validate() {
    let res = [];
    let validateRes = true;
    this.configControlValidateArr();
    this.controlArr.forEach((controlInstanceObj, index) => {
      Object.keys(controlInstanceObj).forEach((attribute) => {
        const fieldElement = this.listCopy[index];
        const value = fieldElement[attribute];
        if (controlInstanceObj[attribute]) {
          res.push(
            controlInstanceObj[attribute].validate &&
              controlInstanceObj[attribute].validate(value)
          );
        }
      });
    });
    validateRes = res.every((resItem) => {
      return resItem == true;
    });
    return validateRes;
  }

  initId() {
    // 如果数组有值并且没有id,给第一项添加id
    if (Array.isArray(this.list)) {
      this.list.forEach((item, index) => {
        if (!this.list[index].hasOwnProperty('keyId')) {
          this.list[index]['keyId'] = uid(8);
          this.listCopy[index]['keyId'] = this.list[index]['keyId'];
        }
      });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { element, namespace, attribute } = nextProps;
    if (namespace) {
      this.list = element[namespace][attribute];
      this.listCopy = element[namespace][attribute];
    } else {
      this.list = element[attribute];
      this.listCopy = element[attribute];
    }
    this.initId();
  }
  componentDidMount() {
    this.initId();
  }
  // controlWrap的componentDidUpdate里面有调用
  configControlValidateArr() {
    const { fields } = this.props;
    this.controlWrapRef.forEach((ControlInstance, index) => {
      if (ControlInstance && ControlInstance.controlRef) {
        Object.keys(ControlInstance.controlRef).forEach((attribute) => {
          if (this.controlArr[index] && fields[attribute].require) {
            this.controlArr[index][attribute] =
              this.controlWrapRef[index].controlRef[attribute];
          }
        });
      }
    });
  }
  runMethod = (method, element) => {
    return function (value, index) {
      return method(element.data, index, value, CALLBACK_UTILS);
    };
  };

  getFieldProps = (key) => {
    const { fields, element } = this.props;
    const _fields = toJS(fields);
    const config = cloneDeep(_fields[key]);
    const { methods } = config;
    if (toString.call(methods) === '[object Object]') {
      for (let methodKey in methods) {
        const method = methods[methodKey];
        methods[methodKey] = this.runMethod(method, element);
      }
    }
    return config;
  };

  onFlowListSortEnd = ({ oldIndex, newIndex }) => {
    const { namespace, element, attribute } = this.props;
    if (
      oldIndex == newIndex ||
      (namespace && element[namespace].length == 1) ||
      newIndex == -1 ||
      (namespace && newIndex == element[namespace].length)
    ) {
      return;
    }
    let originOrderAll = [...toJS(this.listCopy)];
    const oldIndexId = originOrderAll[oldIndex];
    const newIndexId = originOrderAll[newIndex];
    // // 1. 先干掉老的位置的元素
    const entireListIds = originOrderAll.filter((id) => id !== oldIndexId);
    // // 2. 找到新位置在列表中的下标
    let insertIndex = entireListIds.findIndex((id) => id === newIndexId);
    // // 3. 根据移动方向设置插入位置
    if (newIndex > oldIndex) {
      insertIndex += 1;
    }
    entireListIds.splice(insertIndex, 0, oldIndexId);
    if (namespace) {
      element[namespace][attribute] = entireListIds;
      this.listCopy = element[namespace][attribute];
    } else {
      element[attribute] = entireListIds;
      this.listCopy = element[attribute];
    }
    this.list = [...toJS(entireListIds)];
  };
  render() {
    const {
      itemTitle,
      text,
      maxCount = Infinity,
      minCount = 0,
      noDragSort,
      attribute
    } = this.props;
    if (!this.list) return null;
    const length = this.list.length;
    const MoveWidgetOperation = components['MoveWidgetOperation'];
    return (
      <div className="assemble-list-container">
        {text}
        {noDragSort
          ? // 不拖拽
            this.list.map((panel, index) => (
              <div
                key={`${attribute}_${index}`}
                id={'a-' + index}
                className="assemble-list-item"
              >
                {length > minCount && (
                  <Icon
                    type="close"
                    className="remove-assemble-item"
                    onClick={() => this.removeItem(index)}
                  />
                )}
                <div className="assemble-list-item-title">
                  {itemTitle}
                  {index + 1}
                </div>
                {this.getItemControls(index, panel)}
              </div>
            ))
          : // 拖拽
            this.list.map((panel, index) => {
              const moveWidgetOptions = {
                up: length != 1,
                down: length != 1,
                index: index,
                clickMethod: this.onFlowListSortEnd
              };
              return (
                <div
                  key={`${attribute}_${index}`}
                  id={'a-' + index + panel.keyId}
                  className="assemble-list-item"
                >
                  {length > minCount && (
                    <Icon
                      type="close"
                      className="remove-assemble-item"
                      onClick={() => this.removeItem(index)}
                    />
                  )}
                  <div className="assemble-list-item-title">
                    {itemTitle}
                    {index + 1}
                  </div>
                  {this.getItemControls(index, panel)}
                  {MoveWidgetOperation && (
                    <MoveWidgetOperation options={moveWidgetOptions} />
                  )}
                </div>
              );
            })}
        {maxCount && length < maxCount && (
          <Button onClick={this.addItem} style={{ width: '100%' }}>
            {'添加'}
          </Button>
        )}
      </div>
    );
  }
}
export default AssembleList;
