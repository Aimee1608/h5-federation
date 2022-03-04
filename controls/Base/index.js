import React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import { methods } from '../../common/pointcut';

@observer
class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validateRes: {
        stat: true,
        msg: ''
      },
      value: ''
    };
  }
  async beforeChange(params) {
    let { value, namespace, element, attribute } = params;
    let computedAttribute =
      methods['beforeUpdateHook'] &&
      (await methods['beforeUpdateHook'](element, attribute, value, namespace));
    this.props.beforeChange && this.props.beforeChange(params);
    return computedAttribute;
  }
  afterChange(params) {
    let { namespace, element, attribute } = params;
    methods['afterUpdateHook'] &&
      methods['afterUpdateHook'](element, attribute, namespace, 'height');
    this.props.afterChange && this.props.afterChange(params);
  }
  async modify(value, onChange) {
    let { namespace, element, attribute, env } = this.props;
    // 基础控件 beforeChange 钩子函数
    let computedAttribute = await this.beforeChange({
      value,
      namespace,
      element,
      attribute
    });
    if (computedAttribute && !env) {
      // env 不存在，说明是在x-core中使用
      if (!element.modify) {
        element[attribute] = computedAttribute[attribute];
      } else {
        if (namespace) {
          await element.modify(computedAttribute[namespace], namespace);
          onChange &&
            onChange(computedAttribute[namespace], namespace, element);
        } else {
          await element.modify(computedAttribute, namespace);
          onChange && onChange(computedAttribute, namespace, element);
        }
      }
    } else {
      // x-cli 以及其他环境
      if (namespace) {
        element[namespace][attribute] = value;
      } else {
        element[attribute] = value;
      }
    }

    this.validate(value);
    // 基础控件 afterChange 钩子函数
    this.afterChange({ value, namespace, element, attribute });
    this.props.runCascadeOptionsFun &&
      this.props.runCascadeOptionsFun(attribute, value);
  }

  defaultValidate = (value) => {
    const isValueExist = Boolean(
      (Array.isArray(value) && value.length) || value
    );
    this.setState({
      validateRes: {
        stat: isValueExist,
        msg: !isValueExist ? '此项是必填项' : ''
      }
    });
    return isValueExist;
  };

  validate = (e) => {
    let value =
      e && typeof e == 'object' && !Array.isArray(e) ? e.target?.value : e;
    const { validate, require, element } = this.props;
    if (typeof validate === 'function') {
      let res = validate(value, element) || { stat: true };
      this.setState({
        validateRes: res
      });
      return res.stat;
    }
    if (require) {
      return this.defaultValidate(value);
    }
  };
}
export default Base;
