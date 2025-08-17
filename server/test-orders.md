# Orders API Testing Guide

## Test the Orders API Endpoints

### 1. Start the server
```bash
cd server
npm start
```

### 2. Test Creating an Order (POST /api/orders)
```bash
curl -X POST http://localhost:7979/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+977-9876543210",
    "address": "Kathmandu, Nepal",
    "city": "Kathmandu",
    "state": "Bagmati",
    "zipCode": "44600",
    "country": "Nepal",
    "paymentMethod": "esewa",
    "total_amount": 150,
    "cart": [
      {
        "id": "product-1",
        "name": "Test Product",
        "price": 100,
        "quantity": 1,
        "size": "M",
        "color": {"name": "Blue"},
        "images": ["test-image.jpg"]
      }
    ],
    "transaction_uuid": "1234567890",
    "transaction_code": "TEST123",
    "ref_id": "REF123"
  }'
```

### 3. Get All Orders (GET /api/orders)
```bash
# Get all orders
curl http://localhost:7979/api/orders

# Get orders with pagination
curl "http://localhost:7979/api/orders?page=1&limit=5&sortBy=createdAt&sortOrder=desc"

# Get orders by user
curl "http://localhost:7979/api/orders?userId=test-user-123"

# Get orders by status
curl "http://localhost:7979/api/orders?status=pending"
```

### 4. Get Single Order (GET /api/orders/:orderId)
```bash
curl http://localhost:7979/api/orders/[ORDER_ID_FROM_PREVIOUS_RESPONSE]
```

### 5. Update Order Status (PATCH /api/orders/:orderId/status)
```bash
curl -X PATCH http://localhost:7979/api/orders/[ORDER_ID]/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

### 6. Update Payment Info (PATCH /api/orders/:orderId/payment)
```bash
curl -X PATCH http://localhost:7979/api/orders/[ORDER_ID]/payment \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_code": "NEW_CODE",
    "ref_id": "NEW_REF",
    "status": "paid"
  }'
```

### 7. Get Order Statistics (GET /api/orders/stats/summary)
```bash
curl http://localhost:7979/api/orders/stats/summary
```

### 8. Cancel Order (DELETE /api/orders/:orderId)
```bash
curl -X DELETE http://localhost:7979/api/orders/[ORDER_ID] \
  -H "Content-Type: application/json" \
  -d '{"reason": "Customer request"}'
```

## Expected Responses

### Successful Order Creation
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "orderId": "RNA123456ABC",
    "status": "confirmed",
    "total": 150,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Orders List Response
```json
{
  "success": true,
  "orders": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalOrders": 25,
    "hasNext": true,
    "hasPrev": false,
    "limit": 10
  }
}
```