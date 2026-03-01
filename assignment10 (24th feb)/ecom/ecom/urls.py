from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT login endpoint
    path('api/login/', TokenObtainPairView.as_view()),

    # dashboard APIs
    path('', include('dashboard.urls')),
]