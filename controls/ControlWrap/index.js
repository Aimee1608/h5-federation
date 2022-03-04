import React from 'react';
import Controls from 'controls';
import { observer } from 'mobx-react';
// import * as comMethods from '@aimee1608/x-com';
import { autorun } from 'mobx';
@observer
class ControlWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finalOptionsCollection: {},
      configs: {},
      cascadeMap: {}
    };
  }
  async runCascadeOptionsFun(attribute, value, fieldIndex) {
    let { finalOptionsCollection, cascadeMap, configs } = this.state;
    if (typeof value == 'undefined' || !attribute) return;
    const { element, project } = this.props;
    if (cascadeMap[attribute] && cascadeMap[attribute].length > 0) {
      // 如果该属性下有级联的属性，依次执行级联列表下的options方法。
      cascadeMap[attribute].forEach(async (cascadeChild) => {
        const childAttribute = cascadeChild.attribute;
        const config = configs[childAttribute];
        // when返回false时不需要等待options返回;
        if ((config.when && config.when(element, project)) || !config.when) {
          const ctx = {
            // get: comMethods.get,
            // post: comMethods.post,
            widget: element
          };
          // 只有 assembleList 中有 fieldIndex 该项下标
          finalOptionsCollection[childAttribute] = await cascadeChild.options(
            ctx,
            value,
            element,
            fieldIndex
          );
          // 联动父级改变后，级联元素值不变的问题；不想改变该值时，设置 noClearValue 为 true
          if (!cascadeChild.noClearValue) {
            this.controlRef[childAttribute] &&
              this.controlRef[childAttribute].onChange(null);
          }
        }
        this.setState({
          finalOptionsCollection
        });
      });
    }
  }

  getAttributeValue(attribute) {
    const { element, namespace, assembleList, index } = this.props;
    if (assembleList) {
      return assembleList[index][attribute];
    }
    return namespace ? element[namespace][attribute] : element[attribute];
  }

  addCascadeMap(attribute, config) {
    let { cascadeMap } = this.state;
    if (!config.cascade) return;
    // cascade为级联父组件，可能有多个配置依赖同一项
    const cascade = config.cascade;
    if (!Array.isArray(cascadeMap[cascade])) {
      cascadeMap[cascade] = [
        {
          attribute,
          options: config.options,
          noClearValue: config.noClearValue
        }
      ];
    } else {
      cascadeMap[cascade].push({
        attribute,
        options: config.options,
        noClearValue: config.noClearValue
      });
    }
    this.setState({
      cascadeMap: cascadeMap
    });
  }
  async addFinalOptionsCollection(attribute, config) {
    let { finalOptionsCollection } = this.state;
    const { element } = this.props;
    // 有级联父元素时取父元素的值，传递给options;
    const cascade = config.cascade || attribute;
    const value = this.getAttributeValue(cascade);
    // 级联
    autorun(
      async () => {
        const ctx = {
          // get: comMethods.get,
          // post: comMethods.post,
          widget: element
        };
        finalOptionsCollection[attribute] = await config.options(
          ctx,
          value,
          element
        );
        this.setState({
          finalOptionsCollection
        });
      },
      { delay: 200 }
    );
  }

  async UNSAFE_componentWillMount() {
    const { WidgetConfig } = this.props;
    let { configs } = this.state;
    for (const attribute in WidgetConfig) {
      const config = WidgetConfig[attribute];
      configs[attribute] = config;
      if (this.isFun(config.options)) {
        this.addCascadeMap(attribute, config);
        this.addFinalOptionsCollection(attribute, config);
      }
    }
    this.setState({ configs });
    this.controlRef = {};
  }
  isFun(fn) {
    return fn && typeof fn == 'function';
  }
  render() {
    const { element, namespace, project, assembleList, index, env } =
      this.props;
    const { configs, finalOptionsCollection } = this.state;
    return (
      <React.Fragment>
        {Object.keys(configs).map((attribute) => {
          const config = configs[attribute];
          const Control = Controls[config.type];
          const { options, ...restConfig } = config;
          let optionInit = options || [];
          if (this.isFun(options)) {
            optionInit = finalOptionsCollection[attribute] || [];
          }
          let disPlayOption = [element, project];
          if (assembleList) {
            disPlayOption = [
              element.data || assembleList[index],
              index,
              element
            ];
          }
          return Control ? (
            ((config.when && config.when(...disPlayOption)) ||
              !config.when) && (
              <Control
                key={`${element.id}_${attribute}`}
                element={assembleList ? assembleList[index] : element}
                Array
                namespace={namespace}
                elementTarget={element.data}
                fieldIndex={index}
                project={project}
                attribute={attribute}
                env={env}
                ref={(node) => (this.controlRef[attribute] = node)}
                runCascadeOptionsFun={this.runCascadeOptionsFun.bind(this)}
                options={optionInit}
                {...restConfig}
              />
            )
          ) : (
            <div className="error-tip" key="error">
              {config.type}拼写错误或者该控件不存在，请移除该控件
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}
export default ControlWrap;
