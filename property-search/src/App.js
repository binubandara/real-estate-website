import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchProperty from './components/SearchProperty';
import ViewProperty from './components/ViewProperty';
import Jumbotron from './components/jumbotron';

function App() {
  return (
    <Router>
      <Jumbotron/>
      <Routes>
        <Route path="/" element={<SearchProperty />} />
        <Route path="/property/:id" element={<ViewProperty />} />
      </Routes>
    </Router>
  );
}

export default App;