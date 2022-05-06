const mongoose = require('mongoose');
const buyerSchema = new mongoose.Schema(
    {
        nameProduct: {
            type: String,
            require: true,
        },
        price: {
            type: Number,
            require: true,
        },
        addressCreator: {
            type: String,
            required: true,
        },
        addressItem: {
            type: String,
            require: true,
        },
        addressBuyer: {
            type: String,
            require: true,
        },
        urlImage: {
            type: String,
            require: true,
        },
        step: {
            type: Number,
            default: 1
        },
        date: {
            type: Date,
            default: Date.now(),
        }   
    },
)
module.exports = mongoose.model('Buyer', buyerSchema);