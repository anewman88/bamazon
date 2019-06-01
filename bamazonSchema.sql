DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER(8) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(25) NULL,
  unit_price DECIMAL(5,2) NULL,
  stock_quantity INTEGER(5) NULL,
  product_sales DECIMAL(10, 2) DEFAULT 0.00,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INTEGER(8) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100),
  overhead_costs DECIMAL(10, 2),
  PRIMARY KEY (department_id)
);

-- insert products into the product table
INSERT INTO products 
	(product_name, department_name, unit_price, stock_quantity, product_sales) 
VALUES 
	('Organic Chicken 20 lb bag', 'Food', 35.95, 4, 0.00),
	('Organic Beef 20 lb bag', 'Food', 36.95, 5, 0.00),
	('Wild Salmon 20 lb bag', 'Food', 38.95, 6, 0.00),
	('Wild Boar 20 lb bag', 'Food', 40.95, 7, 0.00),
	('Dog Collar-Blue Size-Lg', 'Apparel', 12.95, 20, 0.00),
	('Dog Collar-Blue Size-Md', 'Apparel', 10.95, 10, 0.00),
	('Dog Collar-Blue Size-Sm', 'Apparel', 8.95, 3, 0.00),
	('Tennis Balls 6-pack', 'Toys', 4.95, 5, 0.00),
	('Tennis Ball Blaster/Gun', 'Toys', 19.95, 2, 0.00),
	('Frisbee', 'Toys', 3.95, 8, 0.00 );

-- populate the department table
INSERT INTO departments 
	(department_name, overhead_costs) 
VALUES 
	('Food', 0.00),
	('Apparel', 0.00),
	('Toys', 0.00);

SELECT * FROM products;
SELECT * FROM departments;

