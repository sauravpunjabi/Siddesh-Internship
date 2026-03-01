from django.urls import path
from . import views
from .views import user_info, OrderCreateView, OrderListView

urlpatterns = [
   path('api/dashboard/', views.dashboard_api),
   path('api/user/', user_info),
   path('api/products/', views.prod_api),
   path('api/products/<int:id>/', views.prod_detail_api),
   path('api/orders/create/', OrderCreateView.as_view()),
   path('api/orders/', OrderListView.as_view()),
]