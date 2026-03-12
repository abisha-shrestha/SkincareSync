// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const AuthRouter = require('./Routes/AuthRouter');

// require('dotenv').config();
// require('./Models/db');

// const PORT = process.env.PORT || 3000;

// app.get('/ping', (req,res)=>{
//     res.send('PONG');
// });

// app.use(bodyParser.json());
// app.use(cors());
// app.use('/auth', AuthRouter)
// app.use('/products', AuthRouter)

// app.listen(PORT, ()=>{
//     console.log(`Server is eunning on ${PORT}`)
// });



const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter'); // ADD THIS
const CartRouter = require('./Routes/CartRouter');  // ADD


require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 3000;

app.get('/ping', (req,res)=>{
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/api/products', ProductRouter); 
app.use('/api/cart', CartRouter);  // ADD


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
});
