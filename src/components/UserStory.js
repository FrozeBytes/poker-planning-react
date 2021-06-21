import React from "react";
import { Typography } from 'antd';

const { Title } = Typography;

function UserStory({userStory}) {
  return (
    <div style={{ padding: '20px 0', textAlign: 'center'}}>
        <Title level={2}>{userStory}</Title>
    </div>
  );
}

export default UserStory;