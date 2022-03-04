import React from 'react';
import { observer } from 'mobx-react';
import Control from '../Control';
import Base from '../Base';
import './index.less';

const aligns = [
  'left-top',
  'center-top',
  'right-top',
  'left-center',
  'center-center',
  'right-center',
  'left-bottom',
  'center-bottom',
  'right-bottom'
];

const icons = [
  '↖',
  '↑',
  '↗',
  '←',
  '○',
  '→',
  '↙',
  '↓',
  '↘'
];

@observer
class AlignControl extends Base {

  onChange = async value => {
    let {
      attribute,
      namespace,
      element
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let origin = data.get ? data.get(attribute) : data[attribute];
    value = (origin == value) ? 'free' : value;
    this.modify(value)
  }

  render() {
    let me = this;
    let {
      attribute,
      namespace,
      element
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];

    let options = aligns.map(function (align, index) {
      return (<div key={align} className={['align', align, value == align ? 'align-selected' : ''].join(' ')} onClick={() => {
        me.onChange(align);
      }}>{icons[index]}</div>);
    });

    return (
      <Control {...this.props}>
        <div className='align-container'>
          {options}
        </div>
      </Control>
    );
  }
}
export default AlignControl;
