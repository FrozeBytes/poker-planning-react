import React, { useState, useEffect, useRef } from "react";
import { Layout } from 'antd';
import socketIOClient from "socket.io-client";
import { Typography } from 'antd';
import UserStory from './components/UserStory';
import Member from './components/Members';
import User from './components/User';
import Join from './components/Join';

const ENDPOINT = "http://nodeapp2-env.eba-p4amm3fq.us-east-2.elasticbeanstalk.com/";
const { Header, Footer, Content } = Layout;

const { Title } = Typography;
const socket = socketIOClient(ENDPOINT);

function App() {
  const [name, setName] = useState("");
  const [estimates, setEstimates] = useState([]);
  const members = useRef([]);
  useEffect(() => {
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
  }, []);

  return (
    <Layout>
      <Header>
        <Title level={2} style={{color: "white", padding: '10px 0' }}>Poker Planning</Title>
      </Header>
      <Content style={{ padding: '0 20%', height:'calc(100vh - 130px)', overflowY: 'auto'}}>
        { name === "" && 
          <div style={{
            height: '10em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Join setName={setName} />
          </div>
        }
        { name !== "" &&
          <>
            <UserStory userStory={'As a User, I want to test this app'}/>
            <User name={name} socket={socket}/>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                {
                  estimates.map((data, id) => <Member key={id} name={data.name} storyPoint={data.storyPoint} open={true}/>)
                }
            </div>
          </>
        }
        
        {/* <p>
          It's <time dateTime={response}>{response}</time>
        </p> */}
      </Content>
      <Footer style={{ textAlign: 'left'}}>Created by Franz Calbay © 2021</Footer>
    </Layout>
  );
}

export default App;