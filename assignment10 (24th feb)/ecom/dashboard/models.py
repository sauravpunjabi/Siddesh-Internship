from django.contrib.auth.models import User
from django.db import models


# Profile model
class Profile(models.Model):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # role field → used for role-based dashboard
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return self.user.username


# Customer model
class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name


# Product model
class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


# Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    PAYMENT_METHODS = [
        ('COD', 'COD'),
        ('UPI', 'UPI'),
        ('Card', 'Card'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.id}"


# OrderItem model
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"