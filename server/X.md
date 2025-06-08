### **LocalX**

# **Components**

- **Authentication**

  - Login (Google)
  - Register (Google)

- **Home Page (Shops & Products)**

  - Product list
  - Nearby shops list (Categorized: Electronics, Grocery, Clothing, etc.)
  - Sidebar containing categories
  - Search bar with filters

- **Product Details**

  - List of items with price
  - Product description & reviews

- **Order & Delivery**

  - Address with Contact
  - Cart
  - Checkout
  - Payment Page
  - Delivery tracking (Live status updates)

- **Admin Dashboard (For Shop Owners & Restaurants)**
  - Sales & Order analytics
  - Product management (Add, Edit, Delete items)
  - Promotions & Offers

---

## **Collections (MongoDB)**

- **User**

  - Name, Email, Contact, Address, Orders, Wishlist

- **Shop Owner**

  - Name, Contact, Shop Details, Products, Orders

- **Shops with Products**

  - Shop Name, Location, Product List, Ratings, Reviews

- **Orders**

  - User ID, Shop ID, Items, Status (Pending, Delivered, Canceled), Payment

- **Reviews & Ratings**
  - User ID, Product ID, Rating, Comment

---

## **APIs (Express.js & Node.js)**

### **Authentication APIs**

- **POST** `/api/auth/login` → Google Login
- **POST** `/api/auth/register` → Google Register
- **POST** `/api/auth/logout` → Logout

### **User APIs**

- **GET** `/api/user/:id` → Get user details
- **PUT** `/api/user/:id` → Update user details
- **GET** `/api/user/orders/:id` → Get user orders

### **Shop APIs**

- **GET** `/api/shops` → Get all shops
- **GET** `/api/shops/:id` → Get shop details
- **POST** `/api/shops` → Add a shop (Admin only)
- **PUT** `/api/shops/:id` → Update shop details
- **DELETE** `/api/shops/:id` → Delete a shop

### **Product APIs**

- **GET** `/api/products` → Get all products
- **GET** `/api/products/:id` → Get product details
- **POST** `/api/products` → Add a new product (Shop Owner)
- **PUT** `/api/products/:id` → Update product details
- **DELETE** `/api/products/:id` → Delete a product

### **Order APIs**

- **POST** `/api/orders` → Place a new order
- **GET** `/api/orders/:id` → Get order details
- **PUT** `/api/orders/:id/status` → Update order status
- **GET** `/api/orders/user/:id` → Get orders by user

### **Payment APIs**

- **POST** `/api/payment` → Process payment
- **GET** `/api/payment/status/:id` → Get payment status

### **Review APIs**

- **POST** `/api/reviews` → Add a review
- **GET** `/api/reviews/product/:id` → Get reviews for a product
- **DELETE** `/api/reviews/:id` → Delete a review

---

### **Additional Features**

✅ **Real-time order tracking** using WebSockets  
✅ **Admin analytics dashboard** for business insights  
✅ **Search & Filtering** for better user experience  
✅ **Offers & Promotions** for shop owners



mongosh "mongodb+srv://cluster0.z9jynu3.mongodb.net/myDatabase" --username ajayc
