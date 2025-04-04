# 🚀 REST API Documentation

Bu API, frontend tələbələrinin praktiki işləri üçün hazırlanmışdır. Burada qeydiyyat, giriş, məhsul əlavə etmə, səbət idarəetməsi və daha çox əməliyyatlar mövcuddur.

---

## 🌍 Base URL

http://localhost:8000

---

## 🔐 Authentication (Giriş və Token İstifadəsi)

- **JWT Token** bəzi API-lərə daxil olmaq üçün tələb olunur.
- Token əldə etmək üçün əvvəlcə **login** edilməlidir.
- Token aşağıdakı kimi **Authorization Header** ilə göndərilməlidir:

Authorization: Bearer <token>

---

# 🧑‍💼 User APIs (İstifadəçi API-ləri)

## 📥 1. Register (Qeydiyyat)

- **URL:** `POST /register`
- **Auth Required:** ❌ No

### ✅ Request Body:

```json
{
  "name": "Tarlan",
  "surname": "Alijanov",
  "email": "example@gmail.com",
  "password": "12345678"
}
```

### 📤 Response:

```json
{
  "message": "User is created"
}
```

# 🔑 2. Login (Giriş)

URL: POST /login
Auth Required: ❌ No

### ✅ Request Body:

```json
{
  "email": "example@gmail.com",
  "password": "12345678"
}
```

### 📤 Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

# 📧 3. Send OTP (OTP Göndərilməsi)

URL: POST /send-otp
Auth Required: ❌ No

### ✅ Request Body:

```json
{
  "email": "example@gmail.com"
}
```

### 📤 Response:

```json
{
  "message": "OTP sent to email"
}
```

# 🖼️ 4. Change Profile Image (Profil Şəklinin Dəyişdirilməsi)

URL: PUT /users/profile
Auth Required: ✅ Yes

### ✅ Headers:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
Content-Type: "multipart/form-data"
```

### ✅ Form Data:

profileImage (file)

### 📤 Response:

```json
{
  "message": "Profile image updated successfully",
  "profileImage": "uploads/profileImage-17123456789.png"
}
```

# 🔒 5. Change Password (Şifrəni Dəyiş)

URL: POST /change-password
Auth Required: ✅ Yes

### ✅ Headers:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ✅ Request Body:

```json
{
  "oldPassword": "12345678",
  "newPassword": "newpassword123"
}
```

### 📤 Response:

```json
{
  "message": "Password has been successfully changed"
}
```


🚫 6. Delete Account (Hesabın Silinməsi)
URL: POST /delete-account
Auth Required: ✅ Yes

### ✅ Headers:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ✅ Request Body:

```json
{
  "otp": "123456"
}
```

### 📤 Response:

```json
{
  "message": "User account has been successfully deleted"
}
```

# 🛒 Cart APIs (Səbət API-ləri)

## 🛍️ 1. View Cart (Səbətə Baxış)
URL: GET /cart/:userId
Auth Required: ❌ No

### 📤 Response:

```json
{
  "userId": "1234",
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ]
}
```

## ➕ 2. Add to Cart (Səbətə Məhsul Əlavə Et)

URL: POST /cart
Auth Required: ❌ No

### ✅ Request Body:

```json
{
  "userId": "1234",
  "productId": "1",
  "quantity": 3
}
```

### 📤 Response:

```json
{
  "userId": "1234",
  "items": [
    {
      "productId": "1",
      "quantity": 3
    }
  ]
}
```

# 📦 Product APIs (Məhsul API-ləri)
## 🔍 1. Get All Products (Bütün Məhsulları Göstər)
URL: GET /products
Auth Required: ❌ No

## 📤 Response:
```json
[
  {
    "id": "1",
    "name": "Audi R8",
    "details": "Luxury sports car",
    "price": "190000",
    "productImage": "uploads/audi.png"
  }
]
```

# 🗂️ 2. Get Product By ID (Məhsul Detallarına Bax)
URL: GET /products/:id
Auth Required: ❌ No

## 📤 Response:
```json
{
  "id": "1",
  "name": "Audi R8",
  "details": "Luxury sports car",
  "price": "190000",
  "productImage": "uploads/audi.png"
}
```

# ➕ 3. Add Product (Yeni Məhsul Yarat)
URL: POST /products
Auth Required: ✅ Yes (Admin Only)

### ✅ Headers:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
Content-type: "multipart/form-data"
```

✅ Form Data:
name (string)
details (string)
price (string)
productImage (file)

### ✅ Request Body:

```json
{
  "name": "BMW",
  "details": "Luxury car",
  "price": "84000",
  "productImage": file
}
```

### 📤 Response:

```json
{
  "id": "5",
  "name": "BMW",
  "details": "Luxury car",
  "price": "84000",
  "productImage": "uploads/bmw.png"
}
```

# ✏️ 4. Update Product (Məhsulu Yenilə)
URL: PUT /products/:id
Auth Required: ✅ Yes (Admin Only)

### ✅ Headers:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
Content-type: "multipart/form-data"
```

✅ Form Data:
name (string)
details (string)
price (string)
productImage (file)

### ✅ Request Body:

```json
{
  "name": "BMW",
  "details": "Luxury car",
  "price": "84000",
  "productImage": file
}
```

### 📤 Response:

```json
{
  "message": "Product updated successfully"
}
```

# 🗑️ 5. Delete Product (Məhsulu Sil)
URL: DELETE /products/:id
Auth Required: ✅ Yes (Admin Only)

### ✅ Headers:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
Content-type: "multipart/form-data"
```

### 📤 Response:

```json
{
  "message": "Product deleted successfully"
}
```

# ℹ️ Qeyd (Notes):
Admin API-lər üçün admin roluna malik JWT token tələb olunur.
Data Tipi: JSON formatında göndərilməlidir (yalnız şəkil yükləmələrdə multipart/form-data istifadə olunur).
Təklif və suallarınız üçün əlaqə saxlamaqdan çəkinməyin. 🚀

