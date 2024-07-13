import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

const orderSchema = mongoose.Schema({
    id: { type: String, default: uuidv4 },
    email: emailSchema(),
    products: [
        {
            type: String,
            ref: 'Product',
            index: true,
            required: true
        }
    ],
    status: {
        type: String,
        index: true,
        default: 'CREATED',
        enum: ['CREATED', 'PENDING', 'COMPLETED']
    }
});

function emailSchema () {
    return {
        type: String,
        required: true,
        unique: true,
        validate: validator.isEmail,
        message: props => `${props.value} is not a valid email`
    }
}

async function get (query = {}) {
    const order = await Order.findOne(query)
        .populate('products')
        .exec();

    return order;
}

const Order = mongoose.model('Order', orderSchema);

export { get };
