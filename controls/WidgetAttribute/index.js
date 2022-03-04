import React from 'react';
import { observer } from 'mobx-react';
import { Row, Select } from 'antd';
import WidgetConfig from '../../base/widget';
import { methods } from '../../common/pointcut';
import Controls from 'controls';
import Control from '../Control';

let Option = Select.Option;

@observer
class WidgetAttributeControl extends React.Component {
  handleAttributeChange(value) {
    let { attribute, namespace, element } = this.props;

    let type = value.split(':')[0];
    let key = value.split(':')[1];

    if (!element.modify) {
      element[attribute] = {
        type,
        key
      };
    } else {
      element.modify(
        {
          [attribute]: {
            type,
            key
          }
        },
        namespace
      );
    }
  }

  render() {
    let me = this;
    const props = me.props;
    console.log('props.widget--', props.widget);
    let widget =
      methods['getWidget'] && methods['getWidget'](props.widget.path);
    let { project, attribute, namespace, element } = this.props;

    let data = namespace ? element[namespace] : element;
    let value = (data.get ? data.get(attribute) : data[attribute]) || {};
    if (widget) {
      let getOption = (config, type, filter) => {
        let options = [];

        for (let attribute in config) {
          if (
            config.hasOwnProperty(attribute) &&
            (!filter || (filter && filter(attribute)))
          ) {
            options.push(
              <Option
                key={type + ':' + attribute}
                value={type + ':' + attribute}
              >
                {config[attribute].text}
              </Option>
            );
          }
        }
        return options;
      };
      let dataConfig = methods['getWidgetConfigByType']
        ? methods['getWidgetConfigByType'](widget.type, widget.version)
        : {};
      let options = getOption(
        WidgetConfig,
        'base',
        (attribute) =>
          [
            'width',
            'height',
            'rotate',
            'opacity',
            'bgColor',
            'bgImage',
            'bgImageRepeat'
          ].indexOf(attribute) > -1
      ).concat(getOption(dataConfig.config || {}, 'data'));
      let attributeControl;

      let attributeValue = '0';

      if (value.type && value.key) {
        attributeValue = value.type + ':' + value.key;

        let controlConfig =
          WidgetConfig[value.key] || dataConfig.config[value.key];
        let AttributeControl = Controls[controlConfig.type];

        let modify = (obj) => {
          element.modify(
            {
              [attribute]: {
                type: value.type,
                key: value.key,
                value: obj[value.key]
              }
            },
            namespace
          );
        };

        attributeControl = (
          <AttributeControl
            key={value.key}
            {...controlConfig}
            project={project}
            element={{
              modify: modify,
              [value.key]:
                value.value || widget[value.key] || widget.data[value.key]
            }}
            attribute={value.key}
          />
        );
      }

      return (
        <Control {...props}>
          <Row>
            <Select
              defaultValue="0"
              style={{ width: '100%' }}
              onChange={(id) => me.handleAttributeChange(id)}
              value={attributeValue}
            >
              <Option key="0" value="0">
                {'请选择'}
              </Option>
              {options}
            </Select>
            <div style={{ marginLeft: -10, marginRight: -20 }}>
              {attributeControl}
            </div>
          </Row>
        </Control>
      );
    }

    return null;
  }
}

export default WidgetAttributeControl;
