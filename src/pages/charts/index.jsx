import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Button, Table } from 'antd';

const Home = ({ data }) => {
  const [number, setNumber] = React.useState(0);
  const setYData = (data) => {
    return data.map((item) => Number(item.year));
  };
  const setXData = (data) => {
    return data.map((item) => item.title);
  };
  const xData = setXData(data);
  const yData = setYData(data);

  const option = {
    xAxis: {
      type: 'category',
      data: xData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: yData,
        type: 'line',
      },
    ],
  };

  const columns = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'name',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'age',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'address',
    },
  ];
  return (
    <div className="App">
      <Button type="primary" onClick={() => setNumber((v) => v - 1)}>
        -
      </Button>
      <div>{number}</div>
      <Button type="primary" onClick={() => setNumber((v) => v + 1)}>
        +
      </Button>
      <ReactECharts option={option} />
      <Table dataSource={data} columns={columns} />
    </div>
  );
};
export async function getServerSideProps(context) {
  const res = await fetch(`https://api.oioweb.cn/api/common/history`);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data.result || [],
    }, // will be passed to the page component as props
  };
}
export default Home;
