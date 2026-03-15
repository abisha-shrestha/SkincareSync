require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const CartRouter = require('./Routes/CartRouter');
const WishlistRouter = require('./Routes/WishlistRouter');
const AdminRouter = require('./Routes/AdminRouter');
const UploadRouter = require('./Routes/UploadRouter'); 

// require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => { res.send('PONG'); });

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/cart', CartRouter);
app.use('/api/wishlist', WishlistRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/upload', UploadRouter); // ADD

app.listen(PORT, () => { console.log(`Server is running on ${PORT}`) });