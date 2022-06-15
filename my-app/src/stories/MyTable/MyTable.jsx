import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table } from 'antd';

/**
 * fetchData 需要有固定格式的入参
 **/
function TablePro(props) {
  const { columns, searchComponent: SearchComponent = () => null } = props;
  const [filter, setFilter] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [flag, setFlag] = useState(false);

  // TODO: 自动帮忙处理时间格式
  const fetchData = (params = {}) => {
    console.log('fetch', params);
    props.fetchData(params).then(data => {
      const { total: _total = 0, list = [] } = data || {};
      setDataSource(list);
      setTotal(_total);
    });
  };

  useEffect(() => {
    fetchData();
  }, [flag]);

  return (
    <div>
      <SearchComponent filter={filter} setFilter={(...args) => setFilter(old => ({ ...old, ...args }))} forceReRender={() => setFlag(old => !old)} />
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize,
          total,
          current,
          onChange: (v) => {
            fetchData({ page: v });
            setCurrent(v);
          },
        }}
      />
    </div>
  );
}

export default TablePro;
