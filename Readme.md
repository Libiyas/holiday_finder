# Holiday Management Application

A full-stack application that fetches holiday data from the Calendarific API and allows users to search, filter, and display holidays for a selected country and year.

## Features

- Search holidays by country and year
- Filter by month
- Search by holiday name
- View detailed information for each holiday
- Responsive design for mobile and desktop
- Caching to reduce API calls

## Tech Stack

### Backend

- Django
- Django REST Framework
- SQLite database
- Python requests library for API calls
- Django's caching framework

### Frontend

- React (with Vite)
- Tailwind CSS for styling
- Axios for API requests

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Clone the repository:

   ```
   git clone https://github.com/Libiyas/holiday_finder.git
   cd holiday_finder
   ```

2. Create a virtual environment and activate it:

   ```
   python -m venv venv
   # For Windows
   venv\Scripts\activate
   # For macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:

   ```
   cd holidays_backend
   pip install -r requirements.txt
   cd ..
   ```

4. Create a `.env` file in the `holidays_backend` directory with your Calendarific API key:

   ```
   CALENDARIFIC_API_KEY=your_api_key_here
   CALENDARIFIC_BASE_URL=https://calendarific.com/api/v2/holidays
   ```

5. Run migrations:

   ```
   python manage.py migrate
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

The backend will be running at http://localhost:8000.

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd holidays-frontend
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with the backend API URL:

   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

The frontend will be running at http://localhost:5173.

## API Endpoints

### 1. Get Holidays

- Endpoint: `/api/holidays/`
- Method: GET
- Query Parameters:
  - country: ISO 3166-1 alpha-2 country code (e.g., 'US')
  - year: Four-digit year (e.g., '2023')
  - month: (Optional) Month number (1-12)
- Response: List of holidays matching the criteria

### 2. Search Holidays

- Endpoint: `/api/holidays/search/`
- Method: GET
- Query Parameters:
  - country: ISO 3166-1 alpha-2 country code
  - year: Four-digit year
  - query: Search term to match against holiday names or descriptions
- Response: List of holidays matching the search criteria

## Caching

The application caches holiday data for each country and year combination for 24 hours to reduce the number of API calls to Calendarific. This helps improve performance and avoid hitting API rate limits.

## Error Handling

The application includes robust error handling for:

- API failures
- Invalid input parameters
- Network issues
- Empty search results

## Additional Notes

- The country list in the frontend is a simplified version. In a production application, you would want to fetch the complete list of supported countries from the Calendarific API.
- The application uses Django's in-memory cache for development. For production, consider using Redis or Memcached.

## Future Improvements

- Add pagination for large result sets
- Implement date range filtering
- Add more filtering options (e.g., by holiday type)
- Add user authentication to save favorite holidays
- Implement unit and integration tests

## License

This project is licensed under the MIT License - see the LICENSE file for details.
