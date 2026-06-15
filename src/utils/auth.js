const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

const comparePassword = async (password, hashedPassword) => {
    return  bcrypt.compare(password, hashedPassword)
}

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET || 'testsecret',
        { expiresIn: '7d' }
    )
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'testsecret')
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken }