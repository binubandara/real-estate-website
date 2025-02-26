/**
 * SearchProperty Component
 * Main property search components with:
 * - Search filters
 * - Property listings
 * - Favorites management with drag-and-drop functionality
 * - Responsive grid layout
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { 
  faHeart as fasHeart, 
  faTrash, 
  faAngleUp,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import propertyData from '../data/proprties.json';
import { useFavorites } from '../hooks/useFavorites';

// Initial search criteria state
const initialSearchCriteria = {
  type: '',
  minPrice: '',
  maxPrice: '',
  minBedrooms: '',
  maxBedrooms: '',
  dateAfter: '',
  dateBefore: '',
  postcode: ''
};

const SearchProperty = () => {
  // Initialize favorites functionality from custom hook
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    setFavorites
  } = useFavorites();

  // State for search form
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);

  // State for search results and favorites UI
  const [searchResults, setSearchResults] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);


  // Load initial property data
  useEffect(() => {
    setSearchResults(propertyData.properties || []);
  }, []);


  /**
   * Resets search form to initial state and shows all properties
   */
  const handleResetSearch = () => {
    setSearchCriteria(initialSearchCriteria);
    setSearchResults(propertyData.properties || []);
  };


   /**
    * Updates search criteria state when form inputs change
    * @param {Event} e - Search changes
    */
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

    /**
   * Filters properties based on entered search criteria
   * @param {Event} e - Form submission
   */
  const handleSearch = (e) => {
    e.preventDefault();

    let results = propertyData.properties.filter(property => {

      // Type filter
      if (searchCriteria.type && property.type !== searchCriteria.type) return false;

      // Price range filter
      if (searchCriteria.minPrice && property.price < parseInt(searchCriteria.minPrice)) return false;
      if (searchCriteria.maxPrice && property.price > parseInt(searchCriteria.maxPrice)) return false;

      // Bedrooms range filter
      if (searchCriteria.minBedrooms && property.bedrooms < parseInt(searchCriteria.minBedrooms)) return false;
      if (searchCriteria.maxBedrooms && property.bedrooms > parseInt(searchCriteria.maxBedrooms)) return false;

      // Date range filter
      const propertyDate = new Date(
        property.added.year,
        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(property.added.month),
        property.added.day
      );

      if (searchCriteria.dateAfter && propertyDate < new Date(searchCriteria.dateAfter)) return false;
      if (searchCriteria.dateBefore && propertyDate > new Date(searchCriteria.dateBefore)) return false;

      // Postcode filter
      if (searchCriteria.postcode && !property.postcode.startsWith(searchCriteria.postcode.toUpperCase())) return false;

      return true;
    });

    setSearchResults(results);
  };

   // Toggle favorite status of a property
  const toggleFavorite = (property) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  /**
   * Reorders items in a list for drag and drop
   * @param {Array} list - The list to reorder
   * @param {number} startIndex - Starting position
   * @param {number} endIndex - Ending position
   * @returns {Array} - Reordered list
   */
  const reorderList = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handle drag and drop operations
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If there's no destination do nothing
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    const propertyId = draggableId.split('-')[1];

    try {
      if (source.droppableId === 'FAVORITES' && destination.droppableId === 'FAVORITES') {
        const newFavorites = reorderList(
          favorites,
          source.index,
          destination.index
        );
        setFavorites(newFavorites);
        return;
      }

      // drag from search results to favorites
      if (source.droppableId === 'SEARCH_RESULTS' && destination.droppableId === 'FAVORITES') {
        const property = searchResults.find(p => p.id.toString() === propertyId);
        if (property && !isFavorite(property.id)) {
          addFavorite(property);
        }
        return;
      }

      if (source.droppableId === 'FAVORITES' && destination.droppableId === 'SEARCH_RESULTS') {
        removeFavorite(propertyId);
        return;
      }
    } catch (error) {
      console.error('Error during drag and drop:', error);
    }
  };

/**
 * SearchResultsList Component
 * Memoized component that renders the grid of property cards
 * drag and drop functionality for adding to favorites
 */ 
  const SearchResultsList = React.memo(({ results }) => (
    <Droppable droppableId="SEARCH_RESULTS" isDropDisabled={false}>
      {(provided, snapshot) => (
        <div 
          {...provided.droppableProps} 
          ref={provided.innerRef}
          style={{
            minHeight: snapshot.isDraggingOver ? '100px' : 'auto',
            transition: 'background-color 0.2s ease',
            backgroundColor: snapshot.isDraggingOver ? '#f8f9fa' : 'transparent'
          }}
        >
          <Row>
            {results.map((property, index) => (
              <Col md={6} lg={4} key={property.id}>
                <Draggable 
                  draggableId={`property-${property.id}`} 
                  index={index}
                  isDragDisabled={isFavorite(property.id)}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.7 : 1
                      }}
                      className="mb-4"
                    >

                      {/* Property Card */}
                      <Card>

                        {/* Property Image with Favorite Button */}
                        <div className="position-relative">
                          <Card.Img 
                            variant="top" 
                            src={property.images[0]} 
                            alt={property.type}
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="light"
                            className="position-absolute top-0 end-0 m-2 rounded-circle"
                            onClick={() => toggleFavorite(property)}
                          >
                            <FontAwesomeIcon
                              icon={isFavorite(property.id) ? fasHeart : farHeart}
                              className={isFavorite(property.id) ? 'text-danger' : ''}
                            />
                          </Button>
                        </div>

                        {/* Property Details */}
                        <Card.Body>
                          <Card.Title>{property.type} - {property.bedrooms} Bedrooms</Card.Title>
                          <Card.Text>
                            <strong>£{property.price.toLocaleString()}</strong>
                            <br />
                            {property.location}
                          </Card.Text>
                          <Link to={`/property/${property.id}`} className="btn btn-primary w-100">
                            View Details
                          </Link>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </Draggable>
              </Col>
            ))}
          </Row>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ));

/**
 * FavoritesList Component
 * Memoized component that renders the list of favorite properties
 * drag and drop functionality for reordering and removing favorites
 */
  const FavoritesList = React.memo(() => (
    <Droppable droppableId="FAVORITES">
      {(provided, snapshot) => (
        <div 
          {...provided.droppableProps} 
          ref={provided.innerRef}
          style={{
            minHeight: '100px',
            transition: 'background-color 0.2s ease',
            backgroundColor: snapshot.isDraggingOver ? '#f8f9fa' : 'transparent',
            border: '2px dashed #dee2e6',
            borderRadius: '4px',
            padding: '1rem'
          }}
        >

          {/* Empty state message */}
          {favorites.length === 0 && !snapshot.isDraggingOver && (
            <div className="text-center text-muted py-4">
              Drag properties here to add to favorites
            </div>
          )}

          <Row>

            {/* Favorites Grid */}
            {favorites.map((property, index) => (
              <Col md={6} key={property.id}>
                <Draggable 
                  draggableId={`property-${property.id}`} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.7 : 1
                      }}
                      className="mb-3"
                    >

                      {/* Favorite Property Card */}
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center">

                            {/* Property Summary */}
                            <div>
                              <h6 className="mb-1">{property.type} - {property.bedrooms} bed</h6>
                              <small className="text-muted">{property.location}</small>
                              <div className="mt-1">
                                <strong>£{property.price.toLocaleString()}</strong>
                              </div>
                            </div>

                            {/* Remove from Favorites Button */}
                            <button
                              onClick={() => removeFavorite(property.id)}
                              className="btn btn-link text-danger p-0"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </Draggable>
              </Col>
            ))}
          </Row>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container fluid className="mt-4 px-4">

        {/* Search Form */}
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSearch}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Property Type</Form.Label>
                    <Form.Select 
                      name="type" 
                      value={searchCriteria.type} 
                      onChange={handleSearchChange}
                    >
                      <option value="">Any</option>
                      <option value="House">House</option>
                      <option value="Flat">Flat</option>
                      <option value="Bungalow">Bungalow</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Added After</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateAfter"
                      value={searchCriteria.dateAfter}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Added Before</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateBefore"
                      value={searchCriteria.dateBefore}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="minPrice"
                      value={searchCriteria.minPrice}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxPrice"
                      value={searchCriteria.maxPrice}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Min Bedrooms</Form.Label>
                    <Form.Control
                      type="number"
                      name="minBedrooms"
                      value={searchCriteria.minBedrooms}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Bedrooms</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxBedrooms"
                      value={searchCriteria.maxBedrooms}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control
                      type="text"
                      name="postcode"
                      value={searchCriteria.postcode}
                      onChange={handleSearchChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" type="button" onClick={handleResetSearch}>
                  Reset Search
                </Button>
                <Button variant="primary" type="submit">
                  Search Properties
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Favorites Section */}
        <div className="mb-4">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center w-100"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <span className="me-2">
              <FontAwesomeIcon icon={fasHeart} /> Favorites ({favorites.length})
            </span>
            <FontAwesomeIcon 
              icon={showFavorites ? faAngleUp : faAngleDown}
              className="ms-auto"
            />
          </Button>
          
          {showFavorites && (
            <Card className="mt-2">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Saved Properties</h5>
                {favorites.length > 0 && (
                  <Button 
                    variant="link" 
                    className="text-danger p-0" 
                    onClick={clearFavorites}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Clear All
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <FavoritesList />
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Search Results Section */}
        <h2 className="mb-3">Available Properties ({searchResults.length})</h2>
        <SearchResultsList results={searchResults} />
      </Container>
    </DragDropContext>
  );
};

export default SearchProperty;