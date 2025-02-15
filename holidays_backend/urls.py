from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('holidays.urls')),
    # Add a root URL redirect to the API
    path('', RedirectView.as_view(url='api/', permanent=False)),
]