from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'yourpw'),
    'database': os.getenv('DB_NAME', 'online_retail'),
    'charset': 'utf8mb4'
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = pymysql.connect(**DB_CONFIG)
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def execute_query(query, params=None):
    """Execute database query and return results"""
    connection = get_db_connection()
    if not connection:
        return None
    try:
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        cursor.execute(query, params)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"Query execution error: {e}")
        return None
    finally:
        connection.close()

@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        'message': 'Online Retail Analytics API',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'revenue': '/api/revenue?period=monthly',
            'top_products': '/api/top-products?limit=10',
            'customer_segments': '/api/customer-segments'
        }
    })

@app.route('/api/revenue')
def get_revenue_data():
    """Get revenue trend data"""
    period = request.args.get('period', 'monthly')
    limit = request.args.get('limit', 12, type=int)
    try:
        if period == 'daily':
            query = """
            SELECT
                transaction_date as date,
                total_revenue as revenue,
                total_orders as orders,
                unique_customers as customers
            FROM revenue_trend
            ORDER BY transaction_date DESC
            LIMIT %s
            """
        elif period == 'weekly':
            query = """
            SELECT
                CONCAT(year, '-W', LPAD(week, 2, '0')) as date,
                SUM(total_revenue) as revenue,
                SUM(total_orders) as orders,
                SUM(unique_customers) as customers
            FROM revenue_trend
            GROUP BY year, week
            ORDER BY year DESC, week DESC
            LIMIT %s
            """
        else:  # monthly
            query = """
            SELECT
                CONCAT(year, '-', LPAD(month, 2, '0')) as date,
                SUM(total_revenue) as revenue,
                SUM(total_orders) as orders,
                SUM(unique_customers) as customers
            FROM revenue_trend
            GROUP BY year, month
            ORDER BY year DESC, month DESC
            LIMIT %s
            """
        results = execute_query(query, (limit,))
        if results is None:
            return jsonify({'error': 'Database query failed'}), 500
        results = list(reversed(results))  # show in chronological order
        return jsonify({
            'success': True,
            'data': results,
            'period': period,
            'total_records': len(results)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/top-products')
def get_top_products():
    """Get top products by revenue"""
    limit = request.args.get('limit', 10, type=int)
    sort_by = request.args.get('sort_by', 'revenue')  # revenue, quantity, profit
    try:
        if sort_by == 'quantity':
            order_field = 'total_quantity_sold DESC'
        elif sort_by == 'profit':
            order_field = 'estimated_profit DESC'
        else:
            order_field = 'total_revenue DESC'

        query = f"""
        SELECT
            stock_code,
            description,
            total_quantity_sold as quantity_sold,
            total_revenue as revenue,
            unique_customers,
            avg_unit_price,
            estimated_profit as profit
        FROM top_products
        ORDER BY {order_field}
        LIMIT %s
        """
        results = execute_query(query, (limit,))
        if results is None:
            return jsonify({'error': 'Database query failed'}), 500
        return jsonify({
            'success': True,
            'data': results,
            'sort_by': sort_by,
            'total_records': len(results)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/customer-segments')
def get_customer_segments():
    """Get customer segmentation data"""
    try:
        summary_query = """
        SELECT
            customer_segment as segment,
            customer_count as count,
            avg_recency,
            avg_frequency,
            avg_monetary,
            total_revenue_contribution as total_revenue,
            percentage_of_customers as percentage
        FROM customer_segments_summary
        ORDER BY customer_count DESC
        """
        summary_results = execute_query(summary_query)
        if summary_results is None:
            return jsonify({'error': 'Database query failed'}), 500

        detail_query = """
        SELECT
            customer_segment as segment,
            recency_score,
            frequency_score,
            monetary_score,
            COUNT(*) as customer_count
        FROM customer_rfm
        GROUP BY customer_segment, recency_score, frequency_score, monetary_score
        ORDER BY customer_segment, customer_count DESC
        """
        detail_results = execute_query(detail_query)
        return jsonify({
            'success': True,
            'summary': summary_results,
            'details': detail_results,
            'total_segments': len(summary_results)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard-stats')
def get_dashboard_stats():
    """Get overall dashboard statistics"""
    try:
        stats_query = """
        SELECT
            (SELECT COUNT(DISTINCT customer_id) FROM transactions) as total_customers,
            (SELECT COUNT(DISTINCT invoice_no) FROM transactions) as total_orders,
            (SELECT COUNT(DISTINCT stock_code) FROM transactions) as total_products,
            (SELECT SUM(total_amount) FROM transactions WHERE total_amount > 0) as total_revenue,
            (SELECT COUNT(DISTINCT country_id) FROM transactions) as total_countries
        """
        results = execute_query(stats_query)
        if results is None or len(results) == 0:
            return jsonify({'error': 'Database query failed'}), 500
        return jsonify({
            'success': True,
            'stats': results[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
