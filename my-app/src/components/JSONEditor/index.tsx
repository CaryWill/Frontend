import React, {useEffect, useRef} from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import './index.less';

// 组件本质上还是非受控的，只是我们调用了 onChange 将值给到了父组件
// 不过我们可以通过 defaultValue 来设置默认值
export const Editor = (props) => {
  const _ref = useRef(null);
  const editorRef = useRef(null);

  console.log(props, 'props');

  const {
    aceEditorConfig = {},
    editorConfig = {onChange: (v) => v},
    onChange,
    disabled = false,
  } = props as any;

  useEffect(() => {
    try {
      editorRef.current = new JSONEditor(_ref.current, {
        search: false,
        mainMenuBar: false,
        statusBar: false,
        navigationBar: false,
        mode: 'code',
        ...editorConfig,
        onChange: () => {
          try {
            onChange(JSON.parse(editorRef.current.getText()));
          } catch (err) {
            console.log(err);
          }
        },
      });
      // 自定义高度
      editorRef.current.aceEditor.setOptions({
        maxLines: 30,
        readOnly: disabled,
        ...aceEditorConfig,
      });
    } catch (err) {}
  }, []);

  useEffect(() => {
    editorRef.current.set(props.defaultValue || {});
    props.onChange?.(props.defaultValue || {});
  }, [props.defaultValue]);

  return <span ref={_ref}></span>;
};
