const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
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
        indexProduct: {
            type: Number,
            required: true,
        },
        urlImage: {
            type: String,
            required: true,
        },
        step: {
            type: Number,
            enum: [0,1,2],
            default: 0
        },
        actice: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Product', productSchema);