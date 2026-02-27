from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Avg
from .models import Order, Customer

@api_view(['GET'])
def dashboard_api(request):

    total_revenue = Order.objects.filter(status='Delivered').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    total_orders = Order.objects.count()
    total_customers = Customer.objects.count()
    avg_order_value = Order.objects.aggregate(Avg('total_amount'))['total_amount__avg'] or 0

    data = {
        "revenue": total_revenue,
        "orders": total_orders,
        "customers": total_customers,
        "aov": avg_order_value,
    }

    return Response(data)