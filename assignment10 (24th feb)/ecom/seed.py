import os
import django
import random
from datetime import timedelta, date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecom.settings')
django.setup()

from dashboard.models import Customer, Product, Order, OrderItem

def seed_data():
    print("Creating Customers...")
    customers = [Customer.objects.create(name=f"Customer {i}", email=f"cust{i}@test.com") for i in range(1, 11)]
    
    print("Creating Products...")
    categories = ['Electronics', 'Clothing', 'Home', 'Books']
    products = [Product.objects.create(name=f"Product {i}", category=random.choice(categories), price=round(random.uniform(10.0, 500.0), 2)) for i in range(1, 21)]
    
    print("Creating Orders...")
    for i in range(30):
        order = Order.objects.create(
            customer=random.choice(customers),
            order_date=date.today() - timedelta(days=random.randint(0, 60)),
            status=random.choice(['Pending', 'Delivered', 'Cancelled']),
            payment_method=random.choice(['COD', 'UPI', 'Card']),
            total_amount=0 # Calculated later
        )
        
        total = 0
        for _ in range(random.randint(1, 3)): # 1 to 3 items per order
            product = random.choice(products)
            qty = random.randint(1, 4)
            OrderItem.objects.create(order=order, product=product, quantity=qty)
            total += product.price * qty
            
        order.total_amount = total
        order.save()
        
    print("Database Seeded Successfully!")

if __name__ == '__main__':
    seed_data()
