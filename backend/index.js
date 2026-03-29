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
const OrderRouter = require('./Routes/OrderRouter');
const ProfileRouter = require('./Routes/ProfileRouter');
const AddressRouter = require('./Routes/AddressRouter');
const cleanupDeletedAccounts = require('./jobs/cleanupDeletedAccounts');
const diaryRouter = require('./Routes/DiaryRouter');
const reviewRouter = require('./Routes/ReviewRouter');


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
app.use('/api/upload', UploadRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/addresses', AddressRouter);
app.use('/api/diary', diaryRouter);
app.use('/api/reviews', reviewRouter);



cleanupDeletedAccounts();

app.listen(PORT, () => { console.log(`Server is running on ${PORT}`) });