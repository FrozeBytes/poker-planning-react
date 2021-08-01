import React from "react";
import { Typography, Card } from 'antd';

const { Title } = Typography;

function Member({name, storyPoint, open}) {
  return (
    <Card
      title={<Title level={2} style={{ textAlign: 'center'}}>{name}</Title>}
      size='small'
      style={{
        width: 200,
        flex: '0 1 calc(25% - 1em);'
      }}>
        <div style={{ padding: '20px 0', textAlign: 'center'}}>
          <Title level={2}>{open ? storyPoint ?? '?' : ['1','2','3','5','8','?'].includes(storyPoint) ? 'voted' : 'not voted'}</Title>
        </div>
    </Card>
  );
}

export default Member;