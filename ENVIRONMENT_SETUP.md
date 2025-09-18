# Environment Setup for Yuca Lifestyle Frontend

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Razorpay Configuration
# Get your Razorpay Key ID from https://dashboard.razorpay.com/app/keys
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Backend API URL
VITE_API_BASE_URL=http://localhost:5001
```

## Setup Instructions

1. **Create .env file**: Create a `.env` file in the `frontend/` directory
2. **Add Razorpay Key**: Replace `rzp_test_your_key_id_here` with your actual Razorpay Key ID
3. **Set API URL**: Update the API base URL if your backend runs on a different port
4. **Restart Dev Server**: Restart your development server after adding environment variables

## Getting Razorpay Key ID

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Sign in to your account
3. Copy your Test Key ID (starts with `rzp_test_`)
4. Add it to your `.env` file

## Production Setup

For production, make sure to:
- Use your Live Key ID (starts with `rzp_live_`)
- Set the correct production API URL
- Never commit your `.env` file to version control

## Troubleshooting

If you see "process is not defined" error:
- Make sure you're using `import.meta.env.VITE_` prefix for environment variables
- Restart your development server after adding environment variables
- Check that your `.env` file is in the correct location (frontend directory)
