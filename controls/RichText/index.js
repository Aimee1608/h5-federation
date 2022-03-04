import React from 'react';
import ReactDOM from 'react-dom';
import RichTextEditor from './RichTextEditor';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import Control from '../Control';
import Base from "../Base";

let container = null;
@observer
class RichTextControl extends Base {
  _richText = React.createRef();

  // 点击事件
  showRichText = () => {
    if (!container) {
      container = document.createElement('div');
      document.body.appendChild(container);
    }
    if (this._richText && this._richText.current) {
      this.executeShow()
    } else {
      ReactDOM.render(<RichTextEditor ref={this._richText} />, container);
      setTimeout(this.executeShow);
    }
  }
  // 执行真正的show
  executeShow = () => {
    let {
      attribute, // richText
      namespace, // data
      element 
    } = this.props;
    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];
    this._richText.current.show(value, this.handleOK, ()=>{});
  }
  // 组件的ok事件
  handleOK = async (content) => {
    console.log('富文本返回的数据', content)
    this.modify(content.content);
    // const { element,attribute,namespace } = this.props
    // element[namespace][attribute] = content.content
  }
  render() {
    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <Button onClick={this.showRichText}>修改内容</Button>
      </Control>
    );
  }
}

export default RichTextControl;
