import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

const productSchema = mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    description: { type: String, required: true },
    image: urlSchema(),
    images: urlSchema({ list: true }),
    tags: { type: [String], index: true }
});

function urlSchema (opts = {}) {
    const { list } = opts;
    return {
        type: list ? [String] : String,
        required: true,
        validate: {
            validator: validator.isURL,
            message: props => `${props.value} is not a valid URL`
        }
    }
}

async function list (opts = {}) {
    const { offset, limit, tag } = opts;
    const tags = tag ? { tags: tag } : {};
    const products = await Product.find(tags)
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit);

    return products;
}

const Product = mongoose.model('Product', productSchema);

export {
    list
};
