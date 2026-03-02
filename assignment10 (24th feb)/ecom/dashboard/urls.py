from django.urls import path
from . import views
from .views import user_info, OrderCreateView, OrderListView, ProductListCreateView, ProductDetailView

urlpatterns = [
   path('api/dashboard/', views.dashboard_api),
   path('api/dashboard/advanced/', views.advanced_analytics_api),
   path('api/user/', user_info),
   path('api/products/', ProductListCreateView.as_view()),
   path('api/products/<int:id>/', ProductDetailView.as_view()),
   path('api/orders/create/', OrderCreateView.as_view()),
   path('api/orders/', OrderListView.as_view()),
]