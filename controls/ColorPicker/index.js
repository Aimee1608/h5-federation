import React from 'react';
import { observer } from 'mobx-react';
import Control from '../Control';
import Base from '../Base';
import ColorPicker from 'rc-color-picker';
import parse from 'color-parse';
import Color from 'color';
import 'rc-color-picker/assets/index.css';
import './index.less';

const DEFAULT_RGB = [255, 255, 255];
const DEFAULT_BGCOLOR = [
  '#4A82F7',
  '#f13232',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#7171ef',
  '#ffeb3b'
];

@observer
class ColorPickerControl extends Base {
  toHex = (number) => {
    let hex = number.toString(16);

    if (hex.length <= 1) {
      hex = '0' + hex;
    }

    return hex;
  };
  onClick = async (colors) => {
    this.modify(colors);
  };
  onChange = (colors) => {
    let alpha = colors.alpha;
    let color = Color(colors.color);
    let { controlParams = {} } = this.props;
    const _value =
      'rgba(' +
      color.red() +
      ',' +
      color.green() +
      ',' +
      color.blue() +
      ',' +
      alpha / 100 +
      ')';
    const hexVal =
      '#' +
      this.toHex(color.red()) +
      this.toHex(color.green()) +
      this.toHex(color.blue());
    const value = controlParams.hex ? hexVal : _value;
    this.modify(value);
  };
  render() {
    let { attribute, namespace, element, controlParams = {} } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = (data.get ? data.get(attribute) : data[attribute]) || '';
    let alpha = 1,
      hex = '';
    if (controlParams.hex) {
      alpha = 100;
      hex = value;
    } else {
      let color = parse(value);
      alpha = color.alpha * 100;
      if (color.values.length !== 3) {
        color.values = DEFAULT_RGB;
      }
      hex =
        '#' +
        this.toHex(color.values[0]) +
        this.toHex(color.values[1]) +
        this.toHex(color.values[2]);
    }
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <ColorPicker
          alpha={alpha}
          color={hex}
          onChange={this.onChange}
          placement={'bottomRight'}
          className="editor-color-btn"
        >
          <div className="defalut-color">
            <svg
              className="react-custom-trigger color-select-arrow"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1970"
              width="200"
              height="200"
            >
              <path
                d="M232.1009750366211 325.9915943145752l278.3173799514771 301.2251615524292 282.4366092681885-299.2785215377807c12.401139736175534-13.278865814208983 32.562768459320075-13.235414028167723 45.016050338745124 0.10428428649902344 12.453281879425049 13.331007957458496 12.505424022674559 34.91785526275635-3.093767166137695 48.19672107696532L536.663233757019 695.49689245224c-4.501605033874513 4.310417175292969-9.820103645324707 9.25523042678833-12.687921524047852 10.080814361572266-11.705911159515379 5.049097537994385-26.088452339172367 2.5202035903930664-37.90733814239501-7.569301128387451L183.79127931594843 374.29259967803955c-9.316062927246094-13.391840457916256-9.368205070495605-35.07428169250488 3.0850768089294434-48.41398000717163 12.4619722366333-13.339698314666744 32.70181417465211-13.296246528625488 45.224618911743164 0.11297464370727536z"
                fill="#333333"
                p-id="1971"
              ></path>
            </svg>
          </div>
        </ColorPicker>
        {DEFAULT_BGCOLOR.map((item) => (
          <div
            className="color-block"
            style={{ backgroundColor: item }}
            key={item}
            onClick={this.onClick.bind(this, item)}
          ></div>
        ))}
        <div
          className="color-block color-transparent"
          onClick={this.onClick.bind(this, 'rgba(255, 255, 255, 0)')}
        ></div>
      </Control>
    );
  }
}

export default ColorPickerControl;
