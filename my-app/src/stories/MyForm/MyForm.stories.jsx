import React from 'react';
import { MyForm } from './MyForm';
import { Button } from 'antd';
import 'antd/dist/antd.css';

export default {
  title: 'Example/MyForm',
  component: MyForm,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <MyForm {...args}></MyForm>

export const DynamicFormCreate = Template.bind({});

DynamicFormCreate.args = {
  title: '新建',
  children: <Button>新建</Button>,
  className: 'dynamic-form-create',
}

export const DynamicFormEdit = Template.bind({});
DynamicFormEdit.args = {
  title: '编辑',
  children: <Button>编辑</Button>,
  className: 'dynamic-form-edit',
}
