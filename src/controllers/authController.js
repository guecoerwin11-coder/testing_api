const User = require('../models/User')
const { hashPassword, comparePassword, generateToken } = require('../utils/auth')

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        const hashedPassword = await hashPassword(password)
        const user = await User.create({ name, email, password: hashedPassword })
        const token = generateToken(user)

        res.status(201).json({
            message: 'Registered successfull!',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(user)
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { register, login }