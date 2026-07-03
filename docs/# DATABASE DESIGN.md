# DATABASE DESIGN

## Overview

This document describes the database structure for Sardoba Market.

Database: PostgreSQL

---

# Tables

## Users

Purpose:
Stores all platform users.

Fields:

- id
- full_name
- phone
- role
- created_at

Roles:

- customer
- shop_owner
- admin

---

## Shops

Purpose:
Stores shop information.

Fields:

- id
- owner_id
- shop_name
- description
- address
- latitude
- longitude
- phone
- image
- status
- created_at

Status:

- pending
- approved
- rejected

---

## Categories

Purpose:
Product categories.

Fields:

- id
- name
- icon

Examples:

- Grocery
- Drinks
- Bakery
- Pharmacy
- Electronics

---

## Products

Purpose:
Stores products.

Fields:

- id
- shop_id
- category_id
- name
- description
- image
- price
- stock
- status
- created_at

Status:

- active
- hidden

---

## Reservations

Purpose:
Customer reservations.

Fields:

- id
- product_id
- customer_name
- phone
- latitude
- longitude
- status
- created_at

Status:

- pending
- accepted
- delivered
- cancelled

---

## Notifications

Purpose:
Platform notifications.

Fields:

- id
- user_id
- title
- message
- is_read
- created_at

---

## AI Suggestions

Purpose:
Stores AI recommendations.

Fields:

- id
- shop_id
- type
- message
- created_at

Examples:

- Low Stock
- Discount Suggestion
- Best Seller
- Price Recommendation

---

# Relationships

Users

↓

Shops

↓

Products

↓

Reservations

Products

↓

Categories

Shops

↓

AI Suggestions

Users

↓

Notifications