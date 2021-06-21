import React, { useEffect, useState } from "react";
import { Row, Button, Space } from 'antd';
import Member from './Members';

function User({ name, socket }) {
  const [storyPoint, setStoryPoint] = useState('?');

  useEffect(() => {
    socket.emit('story-point', name, storyPoint);
  }, [storyPoint]);

  return (
    <>
    <div style={{
      height: '10em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Member name={name} storyPoint={storyPoint} open />
    </div>
    <div style={{
      height: '10em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Row>
        <Space>
          {
            [1,2,3,5,8,9].map((data, id) => (
              <Button
                key={id}
                value={data === 9 ? '?' : data}
                size='large'
                onClick={(e) => {
                  console.dir(e.target.value);
                  setStoryPoint(e.target.value);
                }}>
                  {data === 9 ? '?' : data}
                </Button>
              ))
          }
        </Space>
      </Row>
    </div>
    </>
  );
}

export default User;