import React, { useEffect, useState } from "react";
import { Row, Button, Space } from 'antd';
import Member from './Members';

function User({ name, socket, isScrumMaster, isReveal, currentSp }) {
  const [storyPoint, setStoryPoint] = useState('-');

  useEffect(() => {
    currentSp.current = `${storyPoint}`;
    socket.emit('story-point', name, storyPoint);
  }, [storyPoint]);

  const reveal = () => {
    socket.emit('reveal-estimates', !isReveal);
  }

  useEffect(() => {
    !isReveal && setStoryPoint('-');
  }, [isReveal]);

  return (
    <div style={{ margin: '20px 0px' }}>
      <div style={{
        height: '10em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0px'
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
                  disabled={isReveal}
                  key={id}
                  value={data === 9 ? '?' : data}
                  size='large'
                  onClick={(e) => {
                    setStoryPoint(e.target.value);
                }}>
                  {data === 9 ? '?' : data}
                </Button>
              ))
            }
          </Space>
        </Row>
      </div>
      {
        isScrumMaster &&
        <div style={{
          height: '5em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Button
            type='danger'
            value={'Reveal'}
            size='large'
            onClick={(e) => {
              reveal();
          }}>
            { isReveal ? 'Reset' : 'Reveal' }
          </Button>
        </div>
      }
    </div>
  );
}

export default User;