const mongoose = require('mongoose')
const app = require('./src/app')


//mongo database
mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000
})
    .then(() => console.log('✅ Connected to MongoDB!'))
    .catch(err => console.log('❌ DB failed:', err))



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})