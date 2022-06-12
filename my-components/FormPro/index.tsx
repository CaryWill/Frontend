import React, { useState } from 'react';
import { Form, Input, Spin } from 'antd';

/**
 * @description: 表单组件
 * @props loading: 是否加载中, 如果是新建的话可以不传, 如果是需要显示数据的话需要传入
 **/
const App = React.forwardRef((props, ref) => {
  const {
    form,
    data = {},
    loading = false,
    schema = [],
    ...rest
  } = props;
  const { getFieldDecorator } = form;

  if (loading) return <Spin spinning={loading} />

  const renderFormItem = (_schema) => {
    if (_schema.length === 0) return null;
    console.log(_schema.length, 'length')
    return <>{_schema.map(({ label, field, type: Component, options = {}, props: _props = {}, linkage }) => {
      console.log(data?.[field], field);
      // 因为联动第一次是没有值的，所以给了 fallback 值，也就是初始值
      const getFieldValue = () => {
        const v = form.getFieldsValue()?.[field];
        if (v || v !== undefined) {
          return v;
        } else {
          return data?.[field];
        }
      }
      const _subSchema = linkage ? linkage(getFieldValue()) || [] : [];
      console.log(_subSchema, 'subSchema');
      return (
        <>
          <Form.Item label={label}>
            {getFieldDecorator(field, {
              // 默认初始值不用你自己指定，会自动获取 data 里的值
              initialValue: data?.[field],
              ...options
            })(
              <Component {..._props} />
            )}
          </Form.Item>
          {renderFormItem(_subSchema)}
        </>
      )
    })}
    </>;
  }

  console.log(data, 'dd')
  return (
    <Form
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      {...rest}
    >
      {renderFormItem(schema)}
    </Form>
  )
});

const AppWrapper = Form.create()(App);

export default AppWrapper;
