import './index.less';
import React from 'react';
import { observer } from 'mobx-react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import BraftEditorComponent from './BraftEditor';
import Modal from "./Modal";
@observer
class RichTextEditor extends React.Component {
  state = {
    show: true,
    editorState: BraftEditor.createEditorState(null)
  }

  show = (value, ok/**/, cancel/**/) => {
    this.ok = ok;
    this.cancel = cancel;
    this.setState({
      show: true,
      editorState: BraftEditor.createEditorState(value)
    });
  }

  // 确定方法
  handleOk = () => {
    const htmlContent = this.state.editorState.toHTML();
    if (this.ok) {
      this.ok({
        content: htmlContent
      });
    }
    this.setState({
      show: false
    });
  }

  // 取消方法
  handleCancel = () => {
    if (this.cancel) {
      this.cancel();
    }
    this.setState({
      show: false
    });
  }
  // 编辑器值发生变化
  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  }

  render() {
    const excludeControls = ['media', 'code', 'blockquote', 'hr'];
    // TODO: 此处每次隐藏都destory了整个组件，目前测试如果不的话会有BUG，暂时保持原状
    return this.state.show ?
      (
          <Modal title='文本管理器' handleOk={this.handleOk} handleCancel={this.handleCancel}>
            <BraftEditorComponent
                excludeControls={excludeControls}
                value={this.state.editorState}
                onChange={this.handleEditorChange}
            />
          </Modal>
      ) :
      null;
  }
}

export default RichTextEditor;
