import React, { useEffect, useState, useRef } from 'react';
import { Button, Input } from 'antd';
import Modal from '../../components/Modal';
import Table from '../../components/Table';

const SearchComponent = (props) => {
  const { filter, setFilter, forceReRender } = props;
  return <Input placeholder='请输入' style={{
    margin: 15,
    width: 200
  }} value={filter.name} onChange={e => {
    const v = e.target.value;
    setFilter({ name: v })
  }} />
}

function App() {
  const [loading, setLoading] = useState(false);

  const fetchData = (filter) => {
    console.log('filter', filter);
    setLoading(true);
    return new Promise(resolve => {
      const data = {
        total: 20,
        list: [{ name: 'cary', id: 1, modified: new Date() }, { name: 'cary', id: 2, modified: new Date() }]
      }
      setTimeout(() => {
        setLoading(false);
        resolve(data);
      }, 1000);
    })
  }

  const columns = [
    { title: '名称', key: 'name', dataIndex: 'name' },
    { title: '修改人', key: 'operator', dataIndex: 'operator' },
    { title: '修改时间', key: 'modified', dataIndex: 'modified', type: 'date' }
  ]

  return (
    <Table fetchData={fetchData} columns={columns} searchComponent={SearchComponent} loading={loading} />
  );
}

export default {
  title: 'Example/MyTable',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <App {...args}></App>

export const MyTable = Template.bind({});
