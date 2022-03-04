import React from 'react';
import { observer } from 'mobx-react';
import { Button, Tooltip } from 'antd';
import Base from '../Base';
import Control from '../Control';
import { UPLOAD_ACCEPT_LOOKUP } from 'common/constant';
import { components } from 'common/pointcut';
import './index.less';
const inputStyle = { display: 'none' };

@observer
class FilePickerControl extends Base {
  constructor() {
    super();
  }
  _inputRef = React.createRef();

  onClick = () => {
    let { element, checkError, text, controlParams, onChange, elementTarget } =
      this.props;
    // ToDO：此处调用 filePickerBox 传入的 第三个参数 controlParams.type 是
    // 从Widget/type 中读取的。而 另外的地方是写死的，且大小写不一致，需要统一
    components['HEFilePickerShow'] &&
      components['HEFilePickerShow'](
        async ({ selectedFile: file }) => {
          checkError =
            checkError ||
            function () {
              return true;
            };
          if (typeof checkError === 'function') {
            let flag = checkError.call(element, file.url);
            if (flag !== true) {
              return Modal.error({
                title: text + '配置错误提示',
                content: flag
              });
            }
          }
          this.modify(file.url);
          if (onChange && typeof onChange === 'function') {
            onChange({
              selectedFile: file,
              element,
              computedAttribute: computedAttribute
            });
          }
        },
        () => {
          // cancel
        },
        Object.assign({}, controlParams, {
          url: elementTarget && elementTarget.url
        })
      );
  };

  clearFile = () => {
    this.modify('');
  };

  _handleUploadSelect = async (event) => {
    event.preventDefault();
    console.log('event.target.files', event.target.files);
    const url = window.URL.createObjectURL(event.target.files[0]);
    this.modify(url);
  };

  render() {
    let { attribute, namespace, element, controlParams, env, readOnly } =
      this.props;

    let data = namespace ? element[namespace] : element;
    let value = data.get ? data.get(attribute) : data[attribute];

    controlParams || (controlParams = {});

    let type = controlParams.type || 'Image';
    let iconPreview = null;

    if (value) {
      if (type == 'Image') {
        iconPreview = (
          <Tooltip
            overlayClassName="file-preview-box"
            placement="leftTop"
            title={() => {
              return (
                <div className="file-preview-big">
                  <img src={value} />
                </div>
              );
            }}
          >
            <img className="file-preview" src={value} />
          </Tooltip>
        );
      }

      if (type == 'Video') {
        iconPreview = <video className="file-preview" src={value} />;
      }

      if (type == 'Audio') {
        iconPreview = (
          <img
            className="file-preview"
            src={require('../imgs/music.png')}
            title={value}
          />
        );
      }

      if (type == 'File') {
        iconPreview = (
          <img className="file-preview" src={require('../imgs/file.png')} />
        );
      }
    }

    return (
      <Control {...this.props} validateRes={this.state.validateRes}>
        <div className="control-file_picker-container">
          {iconPreview}
          <div>
            {iconPreview && (
              <Button
                size={'small'}
                onClick={this.clearFile}
                style={{ marginRight: 7 }}
                disabled={readOnly}
              >
                {'清空选择'}
              </Button>
            )}
            {env == 'xcli' ? (
              <>
                <Button
                  size={'small'}
                  onClick={this.onClick}
                  disabled={readOnly}
                >
                  {'选择文件'}
                </Button>
                <input
                  ref={this._inputRef}
                  style={inputStyle}
                  type="file"
                  accept={UPLOAD_ACCEPT_LOOKUP[type]}
                  onChange={this._handleUploadSelect}
                />
              </>
            ) : (
              <Button size={'small'} onClick={this.onClick} disabled={readOnly}>
                {'选择文件'}
              </Button>
            )}
          </div>
        </div>
      </Control>
    );
  }
}

export default FilePickerControl;
