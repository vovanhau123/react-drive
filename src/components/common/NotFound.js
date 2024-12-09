import React from 'react';
import { Container, Button, Icon } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="stars"></div>
      <div className="central-body">
        <Container text className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>Oops! Looks like you're lost in space.</p>
          <div className="astronaut-container">
            <div className="astronaut">
              <Icon name="user astronaut" size="huge" />
            </div>
          </div>
          <Button 
            primary
            size="large"
            onClick={() => navigate('/')}
            className="home-button"
          >
            <Icon name="home" />
            Return Home
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default NotFound; 