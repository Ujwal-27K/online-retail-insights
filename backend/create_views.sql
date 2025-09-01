-- Revenue Trend Analysis View
CREATE OR REPLACE VIEW revenue_trend AS
SELECT
    DATE(invoice_date) AS transaction_date,
    YEAR(invoice_date) AS year,
    MONTH(invoice_date) AS month,
    WEEK(invoice_date) AS week,
    COUNT(DISTINCT invoice_no) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_order_value,
    COUNT(DISTINCT customer_id) AS unique_customers
FROM transactions
WHERE total_amount > 0
GROUP BY DATE(invoice_date), YEAR(invoice_date), MONTH(invoice_date), WEEK(invoice_date)
ORDER BY transaction_date;

-- Create index for performance
CREATE INDEX idx_revenue_trend ON transactions(invoice_date, total_amount);


-- Top Products Analysis View
CREATE OR REPLACE VIEW top_products AS
SELECT
    p.stock_code,
    p.description,
    SUM(t.quantity) AS total_quantity_sold,
    SUM(t.total_amount) AS total_revenue,
    COUNT(DISTINCT t.customer_id) AS unique_customers,
    AVG(t.unit_price) AS avg_unit_price,
    (SUM(t.total_amount) - (SUM(t.quantity) * AVG(t.unit_price) * 0.6)) AS estimated_profit
FROM products p
JOIN transactions t ON p.stock_code = t.stock_code
WHERE t.total_amount > 0
GROUP BY p.stock_code, p.description
ORDER BY total_revenue DESC;

-- Create index for performance
CREATE INDEX idx_top_products ON transactions(stock_code, total_amount);


-- Customer RFM Segmentation View
CREATE OR REPLACE VIEW customer_rfm AS
WITH customer_metrics AS (
    SELECT
        customer_id,
        DATEDIFF(CURDATE(), MAX(DATE(invoice_date))) AS recency_days,
        COUNT(DISTINCT invoice_no) AS frequency,
        SUM(total_amount) AS monetary_value,
        AVG(total_amount) AS avg_order_value
    FROM transactions
    WHERE total_amount > 0
    GROUP BY customer_id
),
rfm_scores AS (
    SELECT
        customer_id,
        recency_days,
        frequency,
        monetary_value,
        avg_order_value,
        NTILE(5) OVER (ORDER BY recency_days ASC) AS recency_score,
        NTILE(5) OVER (ORDER BY frequency DESC) AS frequency_score,
        NTILE(5) OVER (ORDER BY monetary_value DESC) AS monetary_score
    FROM customer_metrics
)
SELECT
    customer_id,
    recency_days,
    frequency,
    monetary_value,
    avg_order_value,
    recency_score,
    frequency_score,
    monetary_score,
    CASE
        WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
        WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
        WHEN recency_score >= 4 AND frequency_score <= 2 THEN 'New Customers'
        WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score <= 2 THEN 'Potential Loyalists'
        WHEN recency_score >= 3 AND frequency_score <= 2 AND monetary_score >= 3 THEN 'Big Spenders'
        WHEN recency_score <= 2 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'At Risk'
        WHEN recency_score <= 2 AND frequency_score >= 2 AND monetary_score >= 2 THEN 'Cannot Lose Them'
        WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'Lost Customers'
        ELSE 'Others'
    END AS customer_segment,
    (recency_score + frequency_score + monetary_score) AS rfm_total_score
FROM rfm_scores
ORDER BY rfm_total_score DESC;

-- Create index for performance
CREATE INDEX idx_customer_rfm ON transactions(customer_id, invoice_date, total_amount);


-- Monthly Revenue Summary View
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT
    YEAR(invoice_date) AS year,
    MONTH(invoice_date) AS month,
    MONTHNAME(invoice_date) AS month_name,
    COUNT(DISTINCT invoice_no) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_order_value,
    COUNT(DISTINCT customer_id) AS unique_customers,
    SUM(total_amount) / COUNT(DISTINCT customer_id) AS revenue_per_customer
FROM transactions
WHERE total_amount > 0
GROUP BY YEAR(invoice_date), MONTH(invoice_date), MONTHNAME(invoice_date)
ORDER BY year, month;


-- Customer Segments Summary View
CREATE OR REPLACE VIEW customer_segments_summary AS
SELECT
    customer_segment,
    COUNT(*) AS customer_count,
    AVG(recency_days) AS avg_recency,
    AVG(frequency) AS avg_frequency,
    AVG(monetary_value) AS avg_monetary,
    SUM(monetary_value) AS total_revenue_contribution,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_rfm), 2) AS percentage_of_customers
FROM customer_rfm
GROUP BY customer_segment
ORDER BY customer_count DESC;
