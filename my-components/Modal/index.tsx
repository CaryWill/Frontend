import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';

const App = (props) => {
  const {
    className = '',
    triggerElement,
    onOk = () => {},
    children,
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);
  const triggerElementProps = triggerElement.props;

  return (
    <>
      <Modal
        title='编辑'
        width={600}
        destroyOnClose={true}
        {...rest}
        wrapClassName={className}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => { onOk?.(); setVisible(false); }}
      >
        {children}
      </Modal>
      {
        React.cloneElement(triggerElement, {
          ...triggerElementProps,
          onClick: () => {
            triggerElementProps.onClick?.();
            setVisible(true);
          },
        })
      }
    </>
  );
};

export default App;
