const { send } = require('express/lib/response');
const Product = require('../models/product')
const Buyer = require('../models/buyer')

exports.getProducts = async(req, res) => {
    const products = await Product.find();
    if(products.length > 0){
        res.status(200).json(products)
    }else{
        res.status(500).json({ success: false, message:"hien tai khong co data"})
    }
    
}

exports.postProduct = async(req, res) => {
    try {
        const addressItemExist = await Product.findOne({addressItem: req.body.addressItem});
        if(addressItemExist) return res.status(500).json({
            success: false,
            message: 'address Item Exist!',
        });
        const newProduct = new Product(req.body);
    
        const savedProduct = await newProduct.save();
        console.log("success")
        res.status(200).json(savedProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.updateProduct = async(req, res) => {
    const addressItem = req.params.addressItem;
    const step = req.body.step;
    const product = await Product.findOne({addressItem: addressItem});

    if(product){
        if(step <= product.step || step > 2 || step < 0) {
            return res.json({ type: 400, message:"Trang thai khong hop le"})
        }
        if(step == product.step + 2 ){
            return res.json({ type: 400, message:"Trang thai khong hop le"})
        }
    }else{
        return res.json({ type: 404, message:"Not found Item"})
    }

   try {
        await Product.findOneAndUpdate(
            { addressItem: addressItem },
            {
                step: step,
            },
        );
        const product = await Product.findOne({addressItem: addressItem});
        return res.status(200).json({ product, msg: "Success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: res.message });
    }
}

exports.updateBuyer = async(req, res) => {
    const addressItem = req.params.addressItem;
   try {
        await Buyer.findOneAndUpdate(
            { addressItem: addressItem },
            {
                step: 2,
            },
        );
        return res.status(200).send({success: true , message: "update Success"});
    } catch (err) {
        console.log(err);
        res.status(500).send("update failed");
    }
}

exports.postBuyProduct = async(req, res) => {
    const addressItemExist = await Buyer.findOne({addressItem: req.body.addressItem});
    if(addressItemExist) return res.status(404).json({
        success: false,
        message: 'address Item Exist!',
    });

    const newBuyer = new Buyer(req.body);
    try {
        const savedBuyer = await newBuyer.save();
        res.status(200).json(savedBuyer);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

exports.getAllBuyerProduct = async(req, res) => {
    console.log("All Product of Buyer")
    const addressBuyer = req.params.addressBuyer;
    const products = await Buyer.find({addressBuyer: addressBuyer}); 
    if(products.length > 0){
        res.json(products)
    }else{
        res.status(500).json({ success: false, message:"not found"})
    }
}

exports.getAllProductOfCreator = async(req, res) => {
    console.log("All Product of Creator")
    const addressOwner = req.params.addressOwner;
    const products = await Product.find({addressCreator: addressOwner}); 
    if(products.length > 0){
        res.json(products)
    }else{
        res.status(500).json({ success: false, message:"not found"})
    }
}