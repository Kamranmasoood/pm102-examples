import mg from 'mongoose'
import 'mongoose-type-email'
import bcrypt from 'bcrypt'
import {PasswordPolicy, charsets} from 'password-sheriff'

const passwordPolicy = new PasswordPolicy({
    length: {minLength: 8},
    contains: {
        expressions: [
            charsets.upperCase,
            charsets.lowerCase,
            charsets.numbers,
            charsets.specialCharacters,
        ]
    },
    identicalChars: {max: 3}
})

const schema = new mg.Schema({
    email: {
        type: mg.Types.Email,
        required: true,
        index: {unique: true},
    },
    password: {
        type: String,
        required: true,
    }
})

const model = mg.model('users', schema)

export async function createUser(email, password) {
    try {
        passwordPolicy.assert(password)
    } catch (e) {
        console.log('password does not conform to password policy:')
        console.log('password must:')
        console.log('- not contain more than 3 identical characters')
        console.log('- contain lower and upper case characters')
        console.log('- contain numbers and special characters')
    }

    const passwordAndSalt = await bcrypt.hash(password, 10)
    const res = await model.create({email, password: passwordAndSalt})
    return res._doc._id
}

export async function authenticate(email, password) {
    const user = await model.findOne({email})
    if (!user) {
        return null
    }
    if (!await bcrypt.compare(password, user.password)) {
        return null
    }
    return user._id
}
