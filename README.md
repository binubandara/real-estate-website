# Property Search Application

A React-based property search application inspired by Rightmove.co.uk that allows users to search for properties using various criteria, view property details, and manage a favorites list.

## 📋 Features

- **Advanced Property Search**: Filter properties by type, price range, number of bedrooms, location, and date added
- **Interactive UI**: Modern React components with Bootstrap styling
- **Property Details**: View detailed information including image galleries, floor plans, and location maps
- **Favorites Management**: Add properties to favorites via drag & drop or button click
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices
- **Local Storage**: Favorites persist between sessions using browser local storage

## 🚀 Technologies Used

- React.js
- React Router
- React Bootstrap
- React DnD (Drag and Drop)
- React Datepicker
- React Select
- React Image Gallery
- Google Maps API
- CSS3 with Media Queries
- Local Storage API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/property-search.git
cd property-search
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google Maps API Key (for the map functionality):
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🏠 Project Structure

```
property-search/
├── public/
│   ├── images/          # Property images
│   └── index.html
├── src/
│   ├── components/      # Reusable UI components
│   ├── data/            # JSON data files
│   ├── pages/           # Main page components
│   ├── styles/          # CSS stylesheets
│   ├── utils/           # Utility functions
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
└── package.json
```

## 🔍 Search Functionality

The application supports searching properties by:
- Property type (house, flat, any)
- Price range (min price, max price)
- Number of bedrooms (min bedrooms, max bedrooms)
- Date added (after specified date or between two given dates)
- Postcode area (first part of the postcode, e.g., BR1, NW1)

## 💾 Local Storage

Favorites are stored in the browser's local storage, allowing them to persist between sessions. The application handles storage as follows:
- Add to favorites: Stores property details in local storage
- Remove from favorites: Removes property from local storage
- Clear favorites: Empties the favorites list from local storage

## 📱 Responsive Design

The application is fully responsive with layouts optimized for:
- Desktop (>= 992px)
- Tablet (768px - 991px)
- Mobile (<= 767px)

Layout changes include:
- Stacked search form elements on smaller screens
- Single column property grid on mobile
- Repositioned favorites list on mobile

## 🔒 Security Measures

- Content Security Policy (CSP) implementation
- XSS protection through React's built-in encoding
- Input sanitization for search parameters
- Secure handling of local storage data

## 📝 Future Enhancements

- User authentication and saved searches
- Property filtering by additional criteria
- Sorting options for search results
- Property comparison feature
- Virtual tours integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.