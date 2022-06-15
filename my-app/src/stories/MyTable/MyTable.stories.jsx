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
    console.log(v)
    setFilter({ name: v })
  }} />
}

function App(props) {
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const [data, setData] = useState([]);

  const fetchData = (params) => {
    return new Promise(resolve => {
      const data = {
        total: 20,
        list: [{ name: 'cary', id: 1 }, { name: 'cary', id: 2 }]
      }
      setTimeout(() => resolve(data), 1000);
    })
  }

  const fetchFormData = () => {
    setLoading(true);
    setTimeout(() => {
      setData({ name: "name", description: "description" });
      setLoading(false);
      setTimeout(() => {
        console.log(ref.current);
      }, 2000)
    }, 1000)
  }

  const columns = [
    { title: '名称', key: 'name', dataIndex: 'name' },
    { title: '修改人', key: 'operator', dataIndex: 'operator' },
    // TODO: time formating
    { title: '修改时间', key: 'modified', dataIndex: 'modified' },
  ]

  return (
    <Table fetchData={fetchData} columns={columns} searchComponent={SearchComponent} />
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
