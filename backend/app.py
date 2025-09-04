# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

app = Flask(__name__)
CORS(app)

class DataGenerator:
    """Generates sample retail data to simulate real API data"""
    
    @staticmethod
    def generate_sales_data(days=30):
        """Generate daily sales data"""
        data = []
        base_amount = 5000
        today = datetime.now()
        
        for i in range(days - 1, -1, -1):
            date = today - timedelta(days=i)
            
            # Weekend sales typically lower
            weekend_multiplier = 0.7 if date.weekday() >= 5 else 1
            
            # Add seasonality and randomness
            seasonal_multiplier = 1 + 0.3 * np.sin(date.timetuple().tm_yday * 2 * np.pi / 365)
            random_multiplier = 0.8 + random.random() * 0.4
            
            amount = int(base_amount * weekend_multiplier * seasonal_multiplier * random_multiplier)
            orders = int(amount / 85)  # Average order value ~$85
            
            data.append({
                'date': date.strftime('%Y-%m-%d'),
                'revenue': amount,
                'orders': orders,
                'avg_order_value': round(amount / orders, 2) if orders > 0 else 0
            })
        
        return data
    
    @staticmethod
    def generate_product_data():
        """Generate top products data"""
        products = [
            {'name': 'iPhone 15 Pro', 'category': 'Electronics', 'price': 999, 'units_sold': 1250},
            {'name': 'Samsung Galaxy S24', 'category': 'Electronics', 'price': 900, 'units_sold': 980},
            {'name': 'Nike Air Max 270', 'category': 'Clothing', 'price': 120, 'units_sold': 780},
            {'name': 'MacBook Air M3', 'category': 'Electronics', 'price': 1200, 'units_sold': 420},
            {'name': 'Adidas Ultraboost 22', 'category': 'Clothing', 'price': 150, 'units_sold': 650},
            {'name': 'Instant Pot Duo', 'category': 'Home & Kitchen', 'price': 80, 'units_sold': 340},
            {'name': 'Kindle Paperwhite', 'category': 'Books', 'price': 140, 'units_sold': 560},
            {'name': 'Yoga Mat Premium', 'category': 'Sports', 'price': 45, 'units_sold': 430},
            {'name': 'AirPods Pro 2', 'category': 'Electronics', 'price': 249, 'units_sold': 890},
            {'name': 'Coffee Maker Pro', 'category': 'Home & Kitchen', 'price': 120, 'units_sold': 320}
        ]
        
        for product in products:
            product['revenue'] = product['price'] * product['units_sold']
            
        # Sort by revenue
        products.sort(key=lambda x: x['revenue'], reverse=True)
        return products
    
    @staticmethod
    def generate_customer_segments():
        """Generate customer segmentation data"""
        return [
            {'segment': 'New Customers', 'count': 2340, 'percentage': 35},
            {'segment': 'Returning Customers', 'count': 3250, 'percentage': 48},
            {'segment': 'VIP Customers', 'count': 850, 'percentage': 13},
            {'segment': 'Inactive Customers', 'count': 290, 'percentage': 4}
        ]
    
    @staticmethod
    def generate_geographic_data():
        """Generate sales by geography"""
        return [
            {'country': 'United States', 'sales': 125000, 'orders': 1450},
            {'country': 'Canada', 'sales': 45000, 'orders': 520},
            {'country': 'United Kingdom', 'sales': 38000, 'orders': 440},
            {'country': 'Germany', 'sales': 32000, 'orders': 380},
            {'country': 'France', 'sales': 28000, 'orders': 320},
            {'country': 'Australia', 'sales': 22000, 'orders': 260},
            {'country': 'Japan', 'sales': 19000, 'orders': 220},
            {'country': 'Brazil', 'sales': 16000, 'orders': 190}
        ]
    
    @staticmethod
    def generate_recent_orders():
        """Generate recent orders data"""
        customers = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emma Brown', 'David Lee', 
                    'Lisa Garcia', 'Tom Anderson', 'Anna Martinez', 'Chris Taylor', 'Maria Rodriguez']
        products = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Nike Air Max', 'MacBook Air', 
                   'Adidas Shoes', 'Coffee Maker', 'Kindle', 'Yoga Mat', 'AirPods Pro', 'Instant Pot']
        statuses = ['Completed', 'Processing', 'Shipped', 'Delivered']
        
        orders = []
        for i in range(200):
            order_date = datetime.now() - timedelta(days=random.randint(0, 30))
            orders.append({
                'id': f'ORD{1000 + i}',
                'customer': random.choice(customers),
                'product': random.choice(products),
                'amount': round(50 + random.random() * 500, 2),
                'status': random.choice(statuses),
                'date': order_date.strftime('%Y-%m-%d')
            })
        
        # Sort by date descending
        orders.sort(key=lambda x: x['date'], reverse=True)
        return orders

# API Routes
@app.route('/api/dashboard/overview', methods=['GET'])
def get_dashboard_overview():
    """Get main dashboard KPIs"""
    days = int(request.args.get('days', 30))
    
    # Calculate KPIs
    sales_data = DataGenerator.generate_sales_data(days)
    
    total_revenue = sum(day['revenue'] for day in sales_data)
    total_orders = sum(day['orders'] for day in sales_data)
    avg_order_value = round(total_revenue / total_orders, 2) if total_orders > 0 else 0
    
    # Simulate some additional metrics
    repeat_customers = random.randint(1200, 1800)
    new_customers = random.randint(800, 1200)
    
    return jsonify({
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'avg_order_value': avg_order_value,
        'repeat_customers': repeat_customers,
        'new_customers': new_customers,
        'conversion_rate': round(2.3 + random.random() * 1.5, 2),
        'period_days': days
    })

@app.route('/api/sales/trends', methods=['GET'])
def get_sales_trends():
    """Get sales trends over time"""
    period = request.args.get('period', 'daily')
    days = int(request.args.get('days', 30))
    
    sales_data = DataGenerator.generate_sales_data(days)
    
    if period == 'weekly' and days >= 7:
        # Group by week
        weekly_data = []
        for i in range(0, len(sales_data), 7):
            week_data = sales_data[i:i+7]
            week_revenue = sum(day['revenue'] for day in week_data)
            week_orders = sum(day['orders'] for day in week_data)
            
            weekly_data.append({
                'date': week_data[0]['date'],
                'revenue': week_revenue,
                'orders': week_orders
            })
        
        return jsonify(weekly_data)
    
    return jsonify(sales_data)

@app.route('/api/products/top', methods=['GET'])
def get_top_products():
    """Get top performing products"""
    limit = int(request.args.get('limit', 10))
    category = request.args.get('category', 'all')
    
    products = DataGenerator.generate_product_data()
    
    if category != 'all':
        products = [p for p in products if p['category'].lower() == category.lower()]
    
    return jsonify(products[:limit])

@app.route('/api/customers/segments', methods=['GET'])
def get_customer_segments():
    """Get customer segmentation data"""
    return jsonify(DataGenerator.generate_customer_segments())

@app.route('/api/sales/geographic', methods=['GET'])
def get_geographic_sales():
    """Get sales by geographic location"""
    return jsonify(DataGenerator.generate_geographic_data())

@app.route('/api/orders/recent', methods=['GET'])
def get_recent_orders():
    """Get recent orders"""
    limit = int(request.args.get('limit', 10))
    orders = DataGenerator.generate_recent_orders()
    return jsonify(orders[:limit])

@app.route('/api/analytics/categories', methods=['GET'])
def get_category_performance():
    """Get performance by product category"""
    products = DataGenerator.generate_product_data()
    
    # Group by category
    category_data = {}
    for product in products:
        category = product['category']
        if category not in category_data:
            category_data[category] = {'revenue': 0, 'units_sold': 0, 'products': 0}
        
        category_data[category]['revenue'] += product['revenue']
        category_data[category]['units_sold'] += product['units_sold']
        category_data[category]['products'] += 1
    
    # Convert to list
    result = []
    for category, data in category_data.items():
        result.append({
            'category': category,
            'revenue': data['revenue'],
            'units_sold': data['units_sold'],
            'products': data['products'],
            'avg_revenue_per_product': round(data['revenue'] / data['products'], 2)
        })
    
    # Sort by revenue
    result.sort(key=lambda x: x['revenue'], reverse=True)
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    # Use environment variables for configuration
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    app.run(host='0.0.0.0', port=port, debug=debug)