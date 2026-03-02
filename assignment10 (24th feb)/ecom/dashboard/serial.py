from rest_framework import serializers
from .models import Product, OrderItem, Order

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSeralizer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSeralizer(many=True, write_only=True)
    # Make total_amount read-only so DRF doesn't demand it in the POST request
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'order_date', 'status', 'payment_method', 'total_amount', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data, total_amount=0)
        total = 0

        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]

            OrderItem.objects.create(order=order, product=product, quantity=quantity)
            total += product.price * quantity

        order.total_amount = total
        order.save()

        return order

