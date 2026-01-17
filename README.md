# Primest Lead Middleware

Simple webhook that filters and transforms solar leads before sending to customer API.

## What It Does

1. **Receives** leads from Primest API
2. **Filters** leads (zipcode must start with `66`, must be house owner)
3. **Transforms** data to customer format
4. **Sends** to customer API

## Quick Start

```bash
# 1. Install
bun install

# 2. Set your USER_ID
cp .env.example .env
nano .env  # Add your USER_ID

# 3. Run
bun run dev
```

Server runs on `http://localhost:3000`

## Test Locally

```bash
# Valid lead (will be accepted)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "123456789",
    "zipcode": "66123",
    "is_owner": true
  }'

# Invalid zipcode (will be rejected)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "12345", "is_owner": true}'

# Not owner (will be rejected)
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"zipcode": "66123", "is_owner": false}'
```

## Test with Primest API

### 1. Expose your local server with ngrok

**macOS:**

```bash
brew install ngrok
```

**Windows:**

```bash
# With Chocolatey
choco install ngrok

# Or download from https://ngrok.com/download
# Extract and run ngrok.exe
```

**Then run:**

```bash
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

### 2. Trigger a real lead

```bash
curl -X POST \
  -H "Authorization: Bearer FakeCustomerToken" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://abc123.ngrok.io/webhook"}' \
  https://contactapi.static.fyi/lead/trigger/fake/YOUR_USER_ID/
```

Replace:

- `https://abc123.ngrok.io` with your ngrok URL
- `YOUR_USER_ID` with your actual user ID

Watch your terminal - you'll see the lead being processed!

## Configuration

Edit `.env`:

```env
USER_ID=your_user_id_here
```

## Customization

Update the data transformation in `src/index.ts` based on `customer_attribute_mapping.json`:

```typescript
const transformedLead = {
  // Map your fields here
  firstName: lead.first_name || "",
  lastName: lead.last_name || "",
  // ... add more fields
};
```

## Logs

- 📥 Received lead
- ✅ Lead accepted
- ❌ Lead rejected
- 🔄 Transformed
- ✅ Sent to customer API

## Files

```
.
├── src/index.ts       # Main code
├── .env               # Your USER_ID
├── package.json       # Dependencies
└── README.md          # This file
```

That's it! 🚀
