const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 3000;

app.get('/ping', (req,res)=>{
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter)
app.use('/products', AuthRouter)

app.listen(PORT, ()=>{
    console.log(`Server is eunning on ${PORT}`)
});

// require('dotenv').config();
// require('./Models/db');

// const express = require('express');
// const app = express();
// const cors = require('cors');

// const AuthRouter = require('./Routes/AuthRouter');
// const ProductRouter = require('./Routes/ProductRouter');

// app.use(express.json());
// app.use(cors());

// app.get('/ping', (req,res)=>{
//     res.send('PONG');
// });

// app.use('/auth', AuthRouter);
// app.use('/products', ProductRouter);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, ()=>{
//     console.log(`Server is running on ${PORT}`);
// });