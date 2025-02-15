from django.urls import path
from django.http import JsonResponse
from .views import HolidayListView, HolidaySearchView

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to the Holidays API',
        'endpoints': {
            'holidays': '/api/holidays/',
            'search': '/api/holidays/search/'
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('holidays/', HolidayListView.as_view(), name='holiday-list'),
    path('holidays/search/', HolidaySearchView.as_view(), name='holiday-search'),
]