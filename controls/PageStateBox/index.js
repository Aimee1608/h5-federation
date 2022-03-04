import { observer } from 'mobx-react';
import Control from '../Control';
import './index.less';
import React from 'react';
import { Button } from 'antd';
import { components } from '../../common/pointcut';

@observer
class PageStateBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Control
    };
  }
  _pageStateBox = React.createRef();

  openDataBox = () => {
    this._pageStateBox.current && this._pageStateBox.current.show();
  };

  render() {
    let { project } = this.props;
    const { Control } = this.state;
    const HEPageStateBox = components['HEPageStateBox'];
    if (!Control) {
      return null;
    }
    return (
      <Control {...this.props}>
        <div>
          <Button size={'small'} onClick={this.openDataBox}>
            配置页面变量
          </Button>
          {HEPageStateBox && (
            <HEPageStateBox project={project} ref={this._pageStateBox} />
          )}
        </div>
      </Control>
    );
  }
}
export default PageStateBox;
