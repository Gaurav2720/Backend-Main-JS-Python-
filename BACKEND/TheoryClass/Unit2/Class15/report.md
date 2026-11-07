# Lab Exercise: Data Modeling (Lecture 15)

## 1. Conceptual Data Model for E-Commerce System

### Entities and Attributes
- **Customer**: `id`, `name`, `email`, `password_hash`, `phone`, `address`
- **Product**: `id`, `name`, `description`, `price`, `stock_quantity`, `category_id`
- **Cart**: `id`, `customer_id`, `created_at`
- **Order**: `id`, `customer_id`, `total_amount`, `status`, `order_date`, `shipping_address`

### Relationships
- **Customer (1) to (1) Cart**: A customer has one active shopping cart.
- **Customer (1) to (M) Order**: A customer can place multiple orders over time.
- **Cart (M) to (N) Product**: A cart can contain multiple products, and a product can be in multiple carts. This is logically resolved using a **CartItem** junction entity (`cart_id`, `product_id`, `quantity`).
- **Order (M) to (N) Product**: An order can contain multiple products, and a product can appear in multiple orders. This is logically resolved using an **OrderItem** junction entity (`order_id`, `product_id`, `quantity`, `price_at_purchase`).

### Constraints
- Customer `email` must be unique and not null.
- Product `price` must be greater than 0.
- Order `status` should be restricted by an enum (e.g., 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').

---

## 2. SQLAlchemy Implementation (Student Management System)

The SQLAlchemy models have been implemented in `student_management.py`. 

### Key Implementations:
- **Relationships**: Established `back_populates` relationships between `Department`, `Student`, `Course`, and `Enrollment`.
- **Cascade Behavior**: Added `cascade="all, delete-orphan"` to the `enrollments` relationship in the `Student` and `Course` models. This ensures that if a student is deleted, their associated enrollment records in the junction table are also automatically deleted, maintaining database integrity and preventing orphaned records.

### CRUD Operations Demonstrated:
1. **Create**: Adds a new `Department` and a new `Student` assigned to that department.
2. **Read**: Queries and retrieves all students who belong to the "CSE" branch.
3. **Update**: Modifies the branch of a specific student from "CSE" to "IT".
4. **Delete**: Deletes the student from the database and programmatically verifies that their associated `Enrollment` records were successfully deleted via the cascade rule.

---

## 3. Mongoose Schemas (Blog Application)

The Mongoose schemas have been implemented in `blog_application.js`.

### Key Implementations:
- **Models**: Defines a `Post` model and an embedded `commentSchema`.
- **Validations applied**:
  - `required`: Ensured title, content, and author fields are mandatory.
  - `minlength` & `maxlength`: Limited the bounds of text for `title` and `content`.
  - `unique`: Applied to the post `title`.
  - `enum`: Ensures the `status` of a post can only be 'draft', 'published', or 'archived'.
- **Timestamps**: Uses `createdAt` and a pre-save hook to automatically manage the `updatedAt` field on posts.
