from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg
from .models import Order, Customer, Profile, Product
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

    #to decide role.
    if user.is_superuser:
        role = "Admin"
    elif user.is_staff:
        role = "Staff"
    else:
        role = "user"

    data = {
        "username" : user.username,
        "role" : role,
    }

    return Response(data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def prod_api(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializers = ProductSerializer(products, many = True)
        return Response(serializers.data)
    
    if request.method == 'POST':
        serializers = ProductSerializer(data = request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status = 201)
        return Response(serializers.errors, status = 400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def prod_detail_api(request, id):
    try:
        product = Product.objects.get(id = id)
    except Product.DoesNotExist:
        return Response({"error" : "Product not found"}, status = 404)

#update:
    if request.method == 'PUT':
        serializers = ProductSerializer(product, data = request.data)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)

#delete:
    if request.method == 'DELETE':
        product.delete()
        return Response({"message" : "Product deleted"})


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

