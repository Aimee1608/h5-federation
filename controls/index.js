import Slider from './Slider';
import TimePicker from './TimePicker';
import NormalText from './NormalText';
import RichText from './RichText';
import FilePicker from './FilePicker';
import ColorPicker from './ColorPicker';
import RadioButton from './RadioButton';
import Radio from './Radio';
import CheckBox from './CheckBox';
import CheckBoxControl from './CheckBoxControl';

import Select from './Select';
import MultipleSelect from './MultipleSelect';
import Set from './Set';
import Align from './Align';
import WidgetSelect from './WidgetSelect';
import WidgetAttribute from './WidgetAttribute';
import Margin from './Margin';
import AssembleList from './AssembleList';
import PageSelect from './PageSelect';
import InputNumber from './InputNumber';
import PageStateControl from './PageStateControl';
import PageStateTypeControl from './PageStateTypeControl';
import ListenerSelect from './ListenerSelect';
import CurrentPageWidgetSelect from './CurrentPageWidgetSelect';
import TriggerSelect from './TriggerSelect';
import DataBox from './DataBox';
import PickData from './PickData';
import PageStateBox from './PageStateBox';
import Control from './Control';
import { useComponents } from '../common/pointcut';
export default {
  // 普通文本
  NormalText,

  // 滑块
  Slider,

  // 富文本
  RichText,

  // 文件选择
  FilePicker,

  // 颜色选择器
  ColorPicker,

  // 单选（按钮样式）
  RadioButton,

  // 单选（普通样式）
  Radio,

  // 多选
  CheckBox,
  CheckBoxControl,

  // 下拉框
  Select,

  InputNumber,

  // 时间选择
  TimePicker,

  // kv列表
  Set,

  // 下拉多选
  MultipleSelect,

  // 位置
  Align,

  // 组件选择
  WidgetSelect,

  // 组件属性修改
  WidgetAttribute,

  // 当前页面组件选择
  CurrentPageWidgetSelect,

  // Margin
  Margin,

  Padding: Margin,

  AssembleList,

  PageSelect,

  PageStateControl,

  PageStateTypeControl,

  // // 当前组件监听器选择
  ListenerSelect,

  DataBox,

  // 变量选择
  PickData,

  // 行为选择
  TriggerSelect,

  // 页面变量
  PageStateBox,

  Control,
  ControlWrap: useComponents['ControlWrap']
};
