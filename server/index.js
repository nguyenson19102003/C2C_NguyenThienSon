const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const userRoute = require('./routes/authRoute.js');
const productRoute = require('./routes/productRoute.js');

const PORT = 5000;

MONGODB_URL= 'mongodb+srv://huynhvovantruong:yBxrpibfyQLRMgoH@cluster0.i5fc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(
    MONGODB_URL, 
    { useNewUrlParser: true }
  )
  .then((result) => console.log("Connection"))
  .catch((error) => console.log('Error'));

app.use(express.json());
app.use(cors());  

//API
app.use('/auth', userRoute);
app.use('/api/products', productRoute);

app.listen(PORT,()=>{
    console.log(`Server is runningon PORT ${PORT}`);
});
