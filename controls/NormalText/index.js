import React from 'react';
import { observer } from 'mobx-react';
import { Input } from 'antd';
import Control from '../Control';
import Base from '../Base';
const TextArea = Input.TextArea;
@observer
class NormalTextControl extends Base {
  onChange = (e) => {
    const value = e.target.value.replace(/^\s+|\s+$/gm, '');
    this.modify(value);
  };

  render() {
    let {
      attribute,
      namespace,
      element,
      placeholder,
      text,
      readOnly,
      onlyKey
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    // 这里加key 是了为防止assembleList的循环时删除操作出现原地复用的情况
    // 使用defaultValue是因为使用value就不能用中文输入法
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        {this.props.style == 'area' ? (
          <TextArea
            key={
              onlyKey && onlyKey !== 'undefined'
                ? onlyKey
                : attribute + '_TextArea'
            }
            className="no-drag"
            placeholder={'请输入' + this.props.text}
            onChange={this.onChange}
            defaultValue={value}
            style={{
              width: this.props.width || '100%'
            }}
            autoSize
            disabled={readOnly}
          />
        ) : (
          <Input
            key={
              onlyKey && onlyKey !== 'undefined'
                ? onlyKey
                : attribute + '_Input'
            }
            className="no-drag"
            placeholder={
              placeholder ? placeholder : `请输入${text ? text : ''}`
            }
            defaultValue={value || ''}
            onChange={this.onChange}
            onBlur={this.validate}
            style={{
              width: this.props.width || '100%'
            }}
            disabled={readOnly}
          />
        )}
      </Control>
    );
  }
}

export default NormalTextControl;
