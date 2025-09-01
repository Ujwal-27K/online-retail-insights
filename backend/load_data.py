import pandas as pd
import pymysql
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class OnlineRetailDataLoader:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', 'yourpw')
        self.database = os.getenv('DB_NAME', 'online_retail')
        self.connection = None

    def connect_to_db(self):
        """Establish database connection"""
        try:
            self.connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                charset='utf8mb4',
                autocommit=True
            )
            print("Database connection established successfully!")
            return True
        except Exception as e:
            print(f"Database connection failed: {e}")
            return False

    def create_database(self):
        """Create database if it doesn't exist"""
        try:
            temp_connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                charset='utf8mb4'
            )
            cursor = temp_connection.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
            cursor.execute(f"USE {self.database}")
            temp_connection.commit()
            temp_connection.close()
            print(f"Database '{self.database}' created/verified successfully!")
        except Exception as e:
            print(f"Error creating database: {e}")

    def download_dataset(self):
        """Use local Excel dataset file for Online Retail II"""
        try:
            # Create data directory if it doesn't exist
            Path("data").mkdir(exist_ok=True)

            excel_path = 'data/online_retail_II.xlsx'

            # Check if file exists in local path
            if not os.path.exists(excel_path):
                print(f"ERROR: Dataset file not found at '{excel_path}'. Please add it manually.")
                return False

            print("Found Excel dataset locally. Reading Excel sheets...")

            # Read both sheets for two years of data
            df1 = pd.read_excel(excel_path, sheet_name="Year 2009-2010")
            df2 = pd.read_excel(excel_path, sheet_name="Year 2010-2011")

            # Concatenate dataframes
            df = pd.concat([df1, df2], ignore_index=True)

            # Convert InvoiceDate to datetime
            df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])

            # Save combined CSV for next phases
            csv_path = 'data/online_retail_ii.csv'
            df.to_csv(csv_path, index=False)
            print("Dataset read and saved as CSV for processing.")

            return True
        except Exception as e:
            print(f"Error processing dataset: {e}")
            return False

    # -- rest of your class unchanged, including create_tables(), load_data(), and run_etl_process() --

    def create_tables(self):
        """Create database tables"""
        cursor = self.connection.cursor()

        # Drop tables if exist
        drop_queries = [
            "DROP TABLE IF EXISTS transactions",
            "DROP TABLE IF EXISTS customers",
            "DROP TABLE IF EXISTS products",
            "DROP TABLE IF EXISTS countries"
        ]
        for query in drop_queries:
            cursor.execute(query)

        # Create countries table
        countries_table = """
        CREATE TABLE countries (
            country_id INT AUTO_INCREMENT PRIMARY KEY,
            country_name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """

        # Create customers table
        customers_table = """
        CREATE TABLE customers (
            customer_id INT PRIMARY KEY,
            country_id INT,
            first_transaction DATE,
            total_orders INT DEFAULT 0,
            total_spent DECIMAL(10,2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (country_id) REFERENCES countries(country_id)
        )
        """

        # Create products table
        products_table = """
        CREATE TABLE products (
            stock_code VARCHAR(20) PRIMARY KEY,
            description TEXT,
            avg_unit_price DECIMAL(10,2),
            total_sold INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """

        # Create transactions table (fact table)
        transactions_table = """
        CREATE TABLE transactions (
            transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_no VARCHAR(20) NOT NULL,
            stock_code VARCHAR(20),
            customer_id INT,
            quantity INT,
            unit_price DECIMAL(10,2),
            invoice_date DATETIME,
            total_amount DECIMAL(10,2),
            country_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (stock_code) REFERENCES products(stock_code),
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
            FOREIGN KEY (country_id) REFERENCES countries(country_id),
            INDEX idx_invoice_date (invoice_date),
            INDEX idx_customer_id (customer_id),
            INDEX idx_stock_code (stock_code)
        )
        """

        tables = [countries_table, customers_table, products_table, transactions_table]
        for table_query in tables:
            cursor.execute(table_query)

        print("Database tables created successfully!")

    def load_data(self):
        """Load data from CSV into database tables"""
        try:
            df = pd.read_csv('data/online_retail_ii.csv')

            # Clean the data
            df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
            df = df.dropna(subset=['CustomerID'])
            df['CustomerID'] = df['CustomerID'].astype(int)
            df['TotalAmount'] = df['Quantity'] * df['UnitPrice']

            # Filter out cancelled transactions (InvoiceNo starting with 'C')
            df['InvoiceNo'] = df['InvoiceNo'].astype(str)
            df = df[~df['InvoiceNo'].str.startswith('C', na=False)]

            cursor = self.connection.cursor()

            # Load countries
            countries = df['Country'].unique()
            for country in countries:
                cursor.execute(
                    "INSERT IGNORE INTO countries (country_name) VALUES (%s)",
                    (country,)
                )

            cursor.execute("SELECT country_id, country_name FROM countries")
            country_map = {name: id for id, name in cursor.fetchall()}

            # Load products
            products = df.groupby('StockCode').agg({
                'Description': 'first',
                'UnitPrice': 'mean',
                'Quantity': 'sum'
            }).reset_index()

            for _, product in products.iterrows():
                cursor.execute(
                    """INSERT IGNORE INTO products 
                    (stock_code, description, avg_unit_price, total_sold) 
                    VALUES (%s, %s, %s, %s)""",
                    (product['StockCode'], product['Description'],
                     product['UnitPrice'], product['Quantity'])
                )

            # Load customers
            customers = df.groupby('CustomerID').agg({
                'InvoiceDate': 'min',
                'InvoiceNo': 'nunique',
                'TotalAmount': 'sum',
                'Country': 'first'
            }).reset_index()

            for _, customer in customers.iterrows():
                cursor.execute(
                    """INSERT IGNORE INTO customers
                    (customer_id, country_id, first_transaction, total_orders, total_spent) 
                    VALUES (%s, %s, %s, %s, %s)""",
                    (customer['CustomerID'], country_map[customer['Country']],
                     customer['InvoiceDate'].date(), customer['InvoiceNo'], customer['TotalAmount'])
                )

            # Load transactions
            for _, row in df.iterrows():
                cursor.execute(
                    """INSERT INTO transactions
                    (invoice_no, stock_code, customer_id, quantity, unit_price,
                     invoice_date, total_amount, country_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                    (row['InvoiceNo'], row['StockCode'], row['CustomerID'],
                     row['Quantity'], row['UnitPrice'], row['InvoiceDate'],
                     row['TotalAmount'], country_map[row['Country']])
                )

            print("Data loaded successfully!")
        except Exception as e:
            print(f"Error loading data: {e}")

    def run_etl_process(self):
        """Run the complete ETL process"""
        print("Starting ETL process...")

        self.create_database()

        if not self.connect_to_db():
            return False

        if not self.download_dataset():
            return False

        self.create_tables()

        self.load_data()

        print("ETL process completed successfully!")
        return True


if __name__ == "__main__":
    loader = OnlineRetailDataLoader()
    loader.run_etl_process()
