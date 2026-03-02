from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg
from .models import Order, Customer, Profile, Product, OrderItem
from .serial import ProductSerializer, OrderSerializer
from rest_framework import generics


#dashboard api
@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def dashboard_api(request):

    #total revenue from delivered orders
    total_revenue = (
        Order.objects
        .filter(status='Delivered')
        .aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    )

    #total orders
    total_orders = Order.objects.count()

    #total customers
    total_customers = Customer.objects.count()

    #average order value
    avg_order_value = (
        Order.objects
        .aggregate(Avg('total_amount'))['total_amount__avg'] or 0
    )

    #data to send to React
    data = {
        "revenue": total_revenue,
        "orders": total_orders,
        "customers": total_customers,
        "aov": avg_order_value,
    }

    return Response(data) 

# code logged in user info
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    # Fetch from the database model you created
    role = user.profile.role if hasattr(user, 'profile') else 'manager'

    return Response({
        "username": user.username,
        "role": role,
    })
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdminOrReadOnly

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-id')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    
    # Add filtering and searching
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']      # Exact match: /api/products/?category=Electronics
    search_fields = ['name', 'category'] # Partial match: /api/products/?search=laptop

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    lookup_field = 'id'

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


from django.db.models.functions import TruncMonth

@api_view(['GET']) 
@permission_classes([IsAuthenticated])
def advanced_analytics_api(request):
    
    # 1. Revenue by Month
    revenue_by_month = Order.objects.filter(status='Delivered') \
        .annotate(month=TruncMonth('order_date')) \
        .values('month') \
        .annotate(revenue=Sum('total_amount')) \
        .order_by('month')
        
    # 2. Top Selling Products (Top 5)
    top_products = OrderItem.objects.values('product__name') \
        .annotate(total_sold=Sum('quantity')) \
        .order_by('-total_sold')[:5]
        
    # 3. Revenue by Payment Method
    payment_revenue = Order.objects.filter(status='Delivered') \
        .values('payment_method') \
        .annotate(revenue=Sum('total_amount'))
        
    # 4. Recent Orders
    recent_orders = Order.objects.order_by('-order_date')[:5]
    recent_serializer = OrderSerializer(recent_orders, many=True)

    return Response({
        "revenue_by_month": list(revenue_by_month),
        "top_products": list(top_products),
        "revenue_by_payment": list(payment_revenue),
        "recent_orders": recent_serializer.data
    })
