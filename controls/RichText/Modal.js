import React from 'react';
import ReactDOM from 'react-dom';

import {Icon} from "antd";
import './index.less'
class Modal extends React.Component{
  constructor(props) {
    super(props);

    this._skyLayer = this._getSkyLayer();
  }
  _getSkyLayer = () => {
    let target = document.getElementById('sky-layer');
    if (target) { return target; }

    const skyLayerElement = document.createElement('div');
    skyLayerElement.id = 'sky-layer';
    if (document.body) {
      document.body.appendChild(skyLayerElement);
    }
    return skyLayerElement;
  }
  render() {
    const {
      handleCancel,
      handleOk,
      children,
      title,
    } = this.props;
    return (
        ReactDOM.createPortal((
            <div className='modal-mask'>
              <div className='modal-main'>
                <div className='modal-header'>
                  <h1 className='modal-header-title'>
                    {title}
                  </h1>
                  <Icon type="close" style={{fontSize:'18px',color:'rgb(214, 214, 214)'}}/>
                </div>
                <div className='modal-content'>
                  {children}
                </div>
                <div className='modal-footer'>
                  <button
                      onClick={handleCancel}
                      className='modal-button-secondary'>
                    取消
                  </button>
                  <button
                      onClick={handleOk}
                      className='modal-button'>
                    确认
                  </button>
                </div>
              </div>
            </div>
        ), this._skyLayer)
    )
  }
}
export default Modal
