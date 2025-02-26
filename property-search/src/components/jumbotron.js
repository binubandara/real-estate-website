import React from 'react';
import { Container } from 'react-bootstrap';
import './jumbotron.css'; 

const Jumbotron = () => {
  return (
    <div className="jumbotron-custom">
      <Container className="text-center text-black">
        <h1 className="display-4">Find Your Dream Property</h1>
        <p className="lead">
          <b>Discover the best properties at unbeatable prices with PropertyGo. 
            Whether you're buying, renting, or just exploring, we have the perfect home for you.</b>
        </p>   
      </Container>
    </div>
  );
};

export default Jumbotron;
