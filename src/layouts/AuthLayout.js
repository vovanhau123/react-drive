import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';

const AuthLayout = () => {
  return (
    <Container>
      <Segment raised style={{ marginTop: '50px', maxWidth: '450px', margin: '50px auto' }}>
        <Outlet />
      </Segment>
    </Container>
  );
};

export default AuthLayout; 