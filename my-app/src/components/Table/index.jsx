import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import { Table } from 'antd';

/**
 * fetchData 需要有固定格式的入参
 **/
function TablePro(props) {
  const { columns, searchComponent: SearchComponent = () => null, ...rest } = props;
  const [filter, setFilter] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [flag, setFlag] = useState(false);

  const fetchData = (params = {}) => {
    props.fetchData(params).then(data => {
      const { total: _total = 0, list = [] } = data || {};
      setDataSource(list);
      setTotal(_total);
    });
  };

  useEffect(() => {
    fetchData();
  }, [flag]);

  const _columns = useMemo(() => {
    return columns.map(item => {
      if (item.type === 'date') {
        return {
          ...item,
          render: (text) => {
            return moment(text).format('YYYY-MM-DD HH:mm:ss');
          }
        };
      }
      return item;
    })
  }, [columns]);

  return (
    <div>
      <SearchComponent
        filter={filter}
        setFilter={(args) => {
          setFilter(old => ({ ...old, ...args }));
        }}
        forceReRender={() => setFlag(old => !old)} />
      <Table
        pagination={{
          pageSize,
          total,
          current,
          onChange: (v) => {
            fetchData({ page: v });
            setCurrent(v);
          },
        }}
        {...rest}
        columns={_columns}
        dataSource={dataSource}
      />
    </div>
  );
}

export default TablePro;
