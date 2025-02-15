import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import HolidaySerializer

class HolidayListView(APIView):
    def get(self, request):
        country = request.query_params.get('country', 'US')
        year = request.query_params.get('year', '2023')
        month = request.query_params.get('month', None)
        
        # Create cache key based on parameters
        cache_key = f'holidays_{country}_{year}'
        if month:
            cache_key += f'_{month}'
        
        # Check if data is in cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        
        # Prepare API call to Calendarific
        api_url = 'https://calendarific.com/api/v2/holidays'
       
        params = {
            'api_key': settings.CALENDARIFIC_API_KEY,
            'country': US,
            'year': 2019
        }
        if month:
            params['month'] = month

        try:
            response = requests.get(api_url, params=params)
            response.raise_for_status()  # Raise exception for 4XX/5XX responses
            
            data = response.json()
            if 'response' in data and 'holidays' in data['response']:
                holidays = data['response']['holidays']
                
                # Validate data through serializer
                serializer = HolidaySerializer(data=holidays, many=True)
                if serializer.is_valid():
                    # Store in cache
                    cache.set(cache_key, serializer.data, settings.CACHE_TTL)
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(
                {'error': 'Invalid response from Calendarific API'}, 
                status=status.HTTP_502_BAD_GATEWAY
            )
            
        except requests.RequestException as e:
            return Response(
                {'error': f'Error fetching data from Calendarific: {str(e)}'}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

class HolidaySearchView(APIView):
    def get(self, request):
        country = request.query_params.get('country', 'US')
        year = request.query_params.get('year', '2023')
        search_term = request.query_params.get('query', '').lower()
        
        if not search_term:
            return Response(
                {'error': 'Search query is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the full holiday list from cache or API
        cache_key = f'holidays_{country}_{year}'
        holidays_data = cache.get(cache_key)
        
        if not holidays_data:
            # If not in cache, we need to fetch it first
            api_url = 'https://calendarific.com/api/v2/holidays'
            params = {
                'api_key': settings.CALENDARIFIC_API_KEY,
                'country': country,
                'year': year
            }
            
            try:
                response = requests.get(api_url, params=params)
                response.raise_for_status()
                
                data = response.json()
                if 'response' in data and 'holidays' in data['response']:
                    holidays = data['response']['holidays']
                    
                    serializer = HolidaySerializer(data=holidays, many=True)
                    if serializer.is_valid():
                        holidays_data = serializer.data
                        cache.set(cache_key, holidays_data, settings.CACHE_TTL)
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(
                        {'error': 'Invalid response from Calendarific API'}, 
                        status=status.HTTP_502_BAD_GATEWAY
                    )
                    
            except requests.RequestException as e:
                return Response(
                    {'error': f'Error fetching data from Calendarific: {str(e)}'}, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
        
        # Filter holidays based on search term
        filtered_holidays = [
            holiday for holiday in holidays_data
            if search_term in holiday['name'].lower() or 
               (holiday['description'] and search_term in holiday['description'].lower())
        ]
        
        return Response(filtered_holidays)