import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import crypto from 'crypto';

const userSchema = mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    firstName: usernameSchema(),
    lastName: usernameSchema(),
    email: emailSchema(),
    password: passwordSchema(),
    salt: { type: String, required: false },
    role: { 
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    }
});

function usernameSchema () {
    return {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    }
}

function emailSchema () {
    return {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [
            {
                validator: validator.isEmail,
                message: props => `${props.value} is not a valid email`
            }
        ]
    }
}

function passwordSchema () {
    return {
        type: String,
        required: true,
        trim: true,
        validate: [
            {
                validator: validator.isStrongPassword,
                message: props => `${props.value} is not a strong password`
            }
        ]
    }
}

async function create (fields = {}) {
    const user = await User.create(fields);
    return user.thin();
}

async function get (query = {}) {
    const user = await User.findOne(query);
    return user;
}

async function list (opts = {}) {
    const { offset = 0, limit = 25 } = opts;
    const users = await User.find({}).sort({ _id: 1 }).skip(offset).limit(limit).exec();
    return users;
}

async function update (query = {}, fields = {}) {
    const user = await User.updateOne(query, fields, { new: true, runValidators: true }).exec();
    return user.thin();
}

async function remove (query = {}) {
    const result = await User.deleteOne(query).exec();
    return result;
}

function hashPassword (password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { hash, salt };
}

function verifyPassword (password, hash, salt) {
    return crypto.timingSafeEqual(
        Buffer.from(crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')),
        Buffer.from(hash, 'hex')
    );
}

/**
 * Criptografa a senha durante a criação ou
 * atualização do documento. Esse middleware
 * é executado após a validação do documento
 * e antes da sua gravação no banco de dados.
 */
userSchema.pre('save', function () {
    const { hash, salt } = hashPassword(this.password);
    [this.password, this.salt] = [hash, salt];
});

/**
 * Chama o middleware anterior.
 * Esse middleware é executado após a atualização 
 * do documento no banco de dados. 
*/
userSchema.post('findOneAndUpdate', async function () {
    const update = this.getUpdate();
    if (!update["$set"].password) return;
    const query = this.getQuery();
    const document = await this.model.findOne(query).exec();
    await document.save();
});

/**
* Evita o retorno de dados mais sensíveis,
* como a senha e o salt do usuário.
*/ 
userSchema.method('thin', function () {
    const document = {
        id,
        firstName,
        lastName,
        email,
        role
    };

    Object.keys(document).forEach(key => document[key] = this[key]);

    return document;
});

const User = mongoose.model('User', userSchema);

export { 
    create,
    get,
    list,
    update,
    remove,
    verifyPassword
};
