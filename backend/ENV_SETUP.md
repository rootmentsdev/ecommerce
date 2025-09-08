# Environment Configuration Guide

## Create a .env file in the backend directory with the following content:

```
# Environment Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://abhirambca2021_db_user:root@cluster0.f4cfeqd.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random
JWT_EXPIRE=7d

# Optional: Database Name
DB_NAME=ecommerce
```

## Important Notes:

1. **MongoDB URI**: I've added `/ecommerce` to your connection string to specify the database name
2. **JWT_SECRET**: Change this to a very long, random string for production
3. **Security**: Never commit the .env file to version control
4. **Database**: The connection will create an "ecommerce" database if it doesn't exist

## Steps to Setup:

1. Create a file named `.env` in the `backend` folder
2. Copy the content above into the `.env` file
3. Make sure MongoDB Atlas is accessible from your IP address
4. Run the backend server: `npm start`

## MongoDB Atlas Security:

Make sure your MongoDB Atlas cluster allows connections from:
- Your current IP address
- Or use 0.0.0.0/0 for development (not recommended for production)
