import React, { useRef } from 'react';
import { Input } from 'antd';
import Modal from '../../components/Modal';
import Form from '../../components/FormPro';
import './myForm.css';

export const MyForm = (props) => {
  const ref = useRef(null);
  const { data, children, title, loading } = props;
  const schema = [
    {
      'field': 'name',
      'label': '名称',
      'type': Input,
      'options': {
        rules: [{ required: true }],
      },
      props: {
        placeholder: '请输入',
        maxLength: 20
      }
    },
    {
      'field': 'description',
      'label': '描述',
      'type': Input.TextArea,
      props: {
        placeholder: '请输入',
        maxLength: 200
      }
    }
  ]

  return (
    <Modal title={title} triggerElement={children} onOk={() => {
    }}>
      <Form ref={ref} schema={schema} data={data} loading={loading} />
    </Modal>
  )
}
