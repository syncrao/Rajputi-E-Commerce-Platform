# Rajputi E-Commerce Platform 👑

An end-to-end **E-commerce solution** for selling **Rajputi Dresses, Suits, and Odhna** across India.  
This project uses **Django REST Framework (Backend)**, **ReactJS (Web Frontend)**, and **React Native (Mobile App)** to provide a seamless shopping experience.

---

## ✨ Features

### Customer Side
- User authentication (Signup/Login with OTP or Email)
- Browse Rajputi dress suits and odhna collections
- Product details with multiple images, price, fabric info
- Add to Cart & Wishlist
- Checkout with **Razorpay Payment Gateway**
- Order history & tracking via **Shiprocket API**

### Admin Side
- Manage products (add, update, delete)
- Manage orders (pending, shipped, delivered)
- Payment & transaction reports
- Customer management

### Other
- Android & iOS Mobile App
- SEO-optimized web frontend
- Push notifications on mobile app
- Secure APIs with JWT authentication

---

## 🛠 Tech Stack

**Backend**
- Django + Django REST Framework  
- PostgreSQL  
- JWT Authentication  

**Frontend (Web)**
- ReactJS  
- Redux Toolkit  
- TailwindCSS / Material UI  
- Axios  

**Mobile App**
- React Native (Expo)  
- React Navigation  
- Razorpay React Native SDK  

**Integrations**
- Razorpay (Payments)  
- Shiprocket API (Shipping & Tracking)  

---

## 📂 Project Structure

```bash
rajputi-ecommerce/
│
├── backend/               # Django REST API
│   ├── accounts/          # User auth & profiles
│   ├── products/          # Product models & APIs
│   ├── orders/            # Orders & checkout
│   ├── payments/          # Razorpay integration
│   ├── shipping/          # Shiprocket integration
│
├── frontend/              # ReactJS web app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Web pages
│   │   ├── redux/         # State management
│   │   └── utils/         # Helpers
│
├── mobile/                # React Native app
│   ├── screens/           # App screens
│   ├── navigation/        # Navigation setup
│   ├── redux/             # State management
│   └── utils/             # Helpers
│
└── README.md              # Main documentation


| Endpoint                  | Method | Description       |
| ------------------------- | ------ | ----------------- |
| `/api/auth/register/`     | POST   | Register new user |
| `/api/auth/login/`        | POST   | Login user        |
| `/api/products/`          | GET    | Get all products  |
| `/api/orders/`            | POST   | Place an order    |
| `/api/payments/razorpay/` | POST   | Initiate payment  |

