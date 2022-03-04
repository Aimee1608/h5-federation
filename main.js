import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from 'mobx';
import ControlWrap from './controls/ControlWrap';
let widget0 = {
  type: 'Aimee',
  name: '线上测试',
  category: 'widget',
  useRem: false,
  config: {
    // content: {
    //   text: '按钮文字',
    //   msg: '提示内容',
    //   type: 'NormalText',
    //   value: '请选择'
    // }
    // total: {
    //   text: '总数',
    //   msg: '0-100',
    //   type: 'Slider',
    //   min: 0,
    //   max: 100
    // },
    // startTime: {
    //   text: '活动开始时间',
    //   type: 'TimePicker'
    // },
    // richText: {
    //   text: '富文本',
    //   type: 'RichText'
    // },
    // color: {
    //   text: '背景色',
    //   type: 'ColorPicker'
    // },
    // subject: {
    //   text: '客户端',
    //   type: 'CheckBox',
    //   options: [
    //     {
    //       text: '学而思客户端',
    //       value: '1'
    //     },
    //     {
    //       text: '微信',
    //       value: '2'
    //     },
    //     {
    //       text: '其他',
    //       value: '3'
    //     }
    //   ]
    // },
    // qualification: {
    //   type: 'Radio',
    //   text: '购买资格限制',
    //   value: true,
    //   options: [
    //     { text: '同学科', value: '1' },
    //     { text: '全学科', value: '0' }
    //   ]
    // },
    // comLogData: {
    //   text: '日志公共字段',
    //   type: 'Set'
    // },
    // select: {
    //   text: '年级--下拉选择',
    //   type: 'Select',
    //   async options(ctx) {
    //     return [
    //       {
    //         text: '一年级',
    //         value: '1'
    //       },
    //       {
    //         text: '二年级',
    //         value: '2'
    //       },
    //       {
    //         text: '三年级',
    //         value: '3'
    //       }
    //     ];
    //   }
    // },
    // courseId: {
    //   text: '课程id（级联，根据年级变化而变化）',
    //   type: 'Select',
    //   cascade: 'select',
    //   async options(ctx, parent) {
    //     if (parent == '3') {
    //       return [
    //         {
    //           text: '3年级数学',
    //           value: '1'
    //         },
    //         {
    //           text: '3年级英语',
    //           value: '2'
    //         }
    //       ];
    //     } else {
    //       return [
    //         {
    //           text: '其他年级数学',
    //           value: '3'
    //         }
    //       ];
    //     }
    //   }
    // },
    // carousels: {
    //   type: 'AssembleList',
    //   text: '轮播图 配置',
    //   minCount: 1, // 最小个数
    //   maxCount: 6, // 最大个数
    //   itemTitle: '配置Item',
    //   fields: {
    //     // fields下的属性的展现形式，也通过设置type来确定
    //     normalText: {
    //       type: 'NormalText',
    //       text: '普通文本'
    //     },
    //
    //     radio: {
    //       type: 'Radio',
    //       text: '单选',
    //       value: true,
    //       options: [
    //         { text: '同学科', value: '1' },
    //         { text: '全学科', value: '0' }
    //       ]
    //     },
    //     radioButton: {
    //       text: '单选-按钮形式',
    //       type: 'RadioButton',
    //       options: [
    //         {
    //           text: '进入页面',
    //           value: 'In'
    //         },
    //         {
    //           text: '离开页面',
    //           value: 'Out'
    //         }
    //       ]
    //     },
    //     checkbox: {
    //       text: '客户端',
    //       type: 'CheckBox',
    //       options: [
    //         {
    //           text: '学而思客户端',
    //           value: '1'
    //         },
    //         {
    //           text: '微信',
    //           value: '2'
    //         },
    //         {
    //           text: '其他',
    //           value: '3'
    //         }
    //       ]
    //     },
    //     select: {
    //       text: '年级--下拉选择',
    //       type: 'Select',
    //       async options(ctx) {
    //         return [
    //           {
    //             text: '一年级',
    //             value: '1'
    //           },
    //           {
    //             text: '二年级',
    //             value: '2'
    //           },
    //           {
    //             text: '三年级',
    //             value: '3'
    //           }
    //         ];
    //       }
    //     },
    //     courseId: {
    //       text: '课程id（级联，根据年级变化而变化）',
    //       type: 'Select',
    //       cascade: 'select',
    //       async options(ctx, parent) {
    //         if (parent === '3') {
    //           return [
    //             {
    //               text: '3年级数学',
    //               value: '1'
    //             },
    //             {
    //               text: '3年级英语',
    //               value: '2'
    //             }
    //           ];
    //         } else {
    //           return [
    //             {
    //               text: '其他年级数学',
    //               value: '3'
    //             }
    //           ];
    //         }
    //       }
    //     },
    //     showGrade: {
    //       type: 'Radio',
    //       text: '是否显示年级',
    //       value: true,
    //       options: [
    //         { text: '是', value: '1' },
    //         { text: '否', value: '0' }
    //       ]
    //     },
    //     multipleSelect: {
    //       text: '年级--下拉多选',
    //       type: 'MultipleSelect',
    //       options: [
    //         {
    //           text: '一年级',
    //           value: '1'
    //         },
    //         {
    //           text: '二年级',
    //           value: '2'
    //         },
    //         {
    //           text: '三年级',
    //           value: '3'
    //         }
    //       ],
    //       when(config, index) {
    //         return (
    //           config.carousels[index] &&
    //           config.carousels[index]['showGrade'] == '1'
    //         );
    //       }
    //     },
    //     filePicker: {
    //       type: 'FilePicker',
    //       controlParams: {
    //         type: 'Image'
    //       },
    //       text: '图片'
    //     },
    //     slider: {
    //       text: '总数--滑块',
    //       msg: '0-100',
    //       type: 'Slider',
    //       min: 0,
    //       max: 100
    //     },
    //     timePicker: {
    //       text: '时间',
    //       type: 'TimePicker'
    //     },
    //     colorPicker: {
    //       text: '背景色',
    //       type: 'ColorPicker'
    //     },
    comLogData: {
      text: '日志公共字段',
      type: 'Set',
      value: {
        clickid: {
          type: String,
          value: '0.1'
        }
      }
    }
    //     richText: {
    //       text: '富文本',
    //       type: 'RichText'
    //     },
    //     courseList: {
    //       type: 'AssembleList',
    //       text: '轮播图 配置',
    //       minCount: 1, // 最小个数
    //       maxCount: 6, // 最大个数
    //       itemTitle: '配置Item',
    //       fields: {
    //         // fields下的属性的展现形式，也通过设置type来确定
    //         src: {
    //           type: 'FilePicker',
    //           controlParams: {
    //             type: 'Image'
    //           },
    //           text: '图片'
    //         },
    //         showCourseId: {
    //           type: 'Radio',
    //           text: '是否显示课程id',
    //           value: true,
    //           options: [
    //             { text: '是', value: '1' },
    //             { text: '否', value: '0' }
    //           ]
    //         },
    //         courseId: {
    //           type: 'NormalText',
    //           text: '课程id',
    //           when(config, index) {
    //             // console.log('config', config, index)
    //             return config['showCourseId'] == '1';
    //           }
    //         },
    //
    //         colorPicker: {
    //           text: '背景色',
    //           type: 'ColorPicker'
    //         }
    //       }
    //     }
    //   }
    // }
  },
  data: {
    content: '快选择啊',
    backgroundColor: 'white',
    selected: 0,
    select: '1',
    richText: '',
    courseId: '',
    total: 0,
    startTime: null,
    color: '#000000',
    subject: [],
    qualification: '1',
    comLogData: {
      clickid: '1.2'
    },
    carousels: [
      {
        normalText: '2222',
        radio: '0',
        radioButton: 'In',
        checkbox: ['1'],
        select: '1',
        courseId: '',
        showGrade: '1',
        multipleSelect: ['1', '2'],
        filePicker: '',
        slider: 4,
        timePicker: '',
        colorPicker: '',
        comLogData: {
          clickid: '1.2'
        },
        richText: '',
        courseList: [
          { colorPicker: '', src: '', courseId: '', showCourseId: '1' }
        ]
      }
    ]
  },
  methods: {},
  version: '0.0.7',
  layers: [],
  visible: true
};

class Widget {
  @observable clazz = 'widget';

  @observable type = '';

  @observable data = observable({});

  @observable version = '';

  constructor(initData = {}) {
    if (!initData.data) {
      initData.data = {};
    }
    Object.assign(this, initData);
  }
}
let widget = new Widget(widget0);
class Clock extends React.Component {
  componentDidMount() {}
  render() {
    console.log('ControlWrap---', ControlWrap);
    return (
      <div
        style={{
          width: '500px',
          margin: '40px auto'
        }}
      >
        <ControlWrap
          key={widget.type}
          WidgetConfig={widget.config}
          project={widget}
          element={widget}
          namespace={'data'}
        ></ControlWrap>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById('main'));
