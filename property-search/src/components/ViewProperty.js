/**
 * ViewProperty Component
 * Component to view  a  property listing including
 * - Images
 * - Property information (Price, locaion, bedrooms etc.)
 * - Detailed description
 * - Floor plans
 * - Google map
 * - Favorite functionality
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import propertyData from '../data/proprties.json';
import { useFavorites } from '../hooks/useFavorites';
import '../App.css'

const ViewProperty = () => {
  // Router hooks for navigation and URL 
  const { id } = useParams();
  const navigate = useNavigate();

  // State for current property and image gallery
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  // Custom hook for managing favorites
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Load property data based on URL
  useEffect(() => {
    const foundProperty = propertyData.properties.find(p => p.id === id);
    if (foundProperty) {
      setProperty(foundProperty);
    } else {
      // Home page if property not found
      navigate('/');
    }
  }, [id, navigate]);

  /**
   * Toggles the favorite status of the current property
   * Handles both adding and removing from favorites
   */
  const toggleFavorite = () => {
    if (!property) return;
    
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  // Handle property not found
  if (!property) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h2>Property not found</h2>
          <Link to="/" className="btn btn-primary mt-3">
            Back to Search
          </Link>
        </div>
      </Container>
    );
  }

  // Google Maps URL with property location using coordinates
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBKmhH7MLMDTZeXBmPvfOgzGuoazmsemXs&q=${property.coordinates.lat},${property.coordinates.lng}`;

  return (
    <Container className="mt-4 mb-4">
      {/* Navigation and Favorites Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/" className="btn btn-outline-primary">
          ← Back to Search
        </Link>
        <Button 
          variant={isFavorite(property.id) ? "danger" : "outline-danger"}
          onClick={toggleFavorite}
        >
          <FontAwesomeIcon 
            icon={isFavorite(property.id) ? fasHeart : farHeart} 
            className="me-2" 
          />
          {isFavorite(property.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>

      <Row>
        {/* Image Gallery Section */}
        <Col md={8}>
          <div className="position-relative">
            {/* Main Image Display */}
            <img
              src={property.images[currentImage]}
              alt={`Property ${currentImage + 1}`}
              className="img-fluid rounded"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />

            {/* Thumbnail Navigation */}
            <div className="mt-3 d-flex gap-2" style={{ overflowX: 'auto' }}>
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="rounded"
                  style={{
                    width: '80px',
                    height: '60px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: currentImage === index ? '2px solid #007bff' : 'none'
                  }}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>
        </Col>

        {/* Property Information Card */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <h2>{property.type} - {property.bedrooms} Bedrooms</h2>
              <h3 className="text-primary">£{property.price.toLocaleString()}</h3>
              <p className="lead">{property.location}</p>
              <hr />
              <p><strong>Tenure:</strong> {property.tenure}</p>
              <p><strong>Added:</strong> {property.added.day} {property.added.month} {property.added.year}</p>
              <p>{property.description}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for description, floorplan and map */}
      <Row className="mt-5">
        <Col>
          <Tabs className="mb-4">
            <TabList>
              <Tab>Description</Tab>
              <Tab>Floor Plan</Tab>
              <Tab>Map</Tab>
            </TabList>

            {/* Description Tab Panel */}
            <TabPanel>
              <Card>
                <Card.Body>
                  <h4>Full Description</h4>
                  <p>{property.longDescription}</p>
                </Card.Body>
              </Card>
            </TabPanel>

            {/* Floor Plan Tab Panel */}
            <TabPanel>
              <Card>
                <Card.Body>
                  <img
                    src={property.floorPlan}
                    alt="Floor Plan"
                    className="img-fluid"
                    style={{ width: '100%', maxWidth: '800px' }}
                  />
                </Card.Body>
              </Card>
            </TabPanel>

            {/* Map Tab Panel */}
            <TabPanel>
              <Card>
                <Card.Body>
                  <div className="ratio ratio-16x9">
                    <iframe
                      title="Property Location"
                      src={mapUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </Card.Body>
              </Card>
            </TabPanel>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewProperty;