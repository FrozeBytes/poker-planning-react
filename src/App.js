import React, { useState, useEffect, useRef } from "react";
import { Layout } from 'antd';
import socketIOClient from "socket.io-client";
import { Typography } from 'antd';
import Member from './components/Members';
import User from './components/User';
import Join from './components/Join';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const ENDPOINT = "http://localhost:4001";
const { Header, Footer, Content } = Layout;

const { Title } = Typography;
const socket = socketIOClient(ENDPOINT);

function App() {
  const [name, setName] = useState("");
  const [isScrumMaster, setIsScrumMaster] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [estimates, setEstimates] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const members = useRef([]);
  const currentSp = useRef('-');

  useEffect(() => {
    socket.on("currentEstimates", (data) => {
      console.dir(data);
      members.current = data;
      setEstimates([...members.current]);
    });

    socket.on("estimates", (data) => {
      const index = members.current.findIndex( ({name}) => name === data.name );
      if (index !== -1) {
        members.current[index].storyPoint = data.storyPoint;
        setEstimates([...members.current]);
      } else {
        members.current.push(data);
        setEstimates(currData => [...currData, data]);
      }
    });

    socket.on("reveal", (data) => {
      console.dir(members.current);
      const newPieChartData = [];
      [ ...members.current, { name, storyPoint: currentSp.current }].forEach((estimate) => {
        const index = newPieChartData.findIndex(( {name}) => name === `SP ${estimate.storyPoint}`);
        if (index !== -1) {
          newPieChartData[index].value = newPieChartData[index].value + 1;
        } else {
          newPieChartData.push({ name: `SP ${estimate.storyPoint}`, value: 1 })
        }
      });
      console.log('new pie chart data');
      console.dir(newPieChartData);
      setPieChartData([...newPieChartData])
      setReveal(data);
    });

    socket.on("remove-user", (data) => {
      members.current = members.current.filter((user) => user.name !== data)
      console.dir(members.current.filter((user) => user.name !== data))
      setEstimates([...members.current]);
    });
  }, []);

  useEffect(() => {
    console.dir(pieChartData);
  }, [pieChartData])

  return (
    <Layout>
      <Header>
        <Title level={2} style={{color: "white", padding: '10px 0' }}>Poker Planning</Title>
      </Header>
      <Content style={{ padding: '0 20%', height:'calc(100vh - 130px)', overflowY: 'auto'}}>
        { name === "" && 
          <div style={{
            height: '20em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

          }}>
            <Join setName={setName} setIsScrumMaster={setIsScrumMaster} />
          </div>
        }
        { name !== "" &&
          <>
            <br />
            <User name={name} socket={socket} isScrumMaster={isScrumMaster} isReveal={reveal} currentSp={currentSp} />
            {
              reveal &&
              <ResponsiveContainer width="100%" height="30%">
                <PieChart width={200} height={200}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            }
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
              {
                estimates.map((data, id) => data.name === name ? null : <Member key={id} name={data.name} storyPoint={data.storyPoint} open={reveal}/>)
              }
            </div>
          </>
        }
      </Content>
      <Footer style={{ textAlign: 'left'}}>Created by Franz Calbay © 2021</Footer>
    </Layout>
  );
}

export default App;