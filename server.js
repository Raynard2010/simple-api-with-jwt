const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

// dummy data
const user = {
    email: 'admin@email.com',
    password: 'admin123'
}

const JWT_SECRET = "key123";

// get request
app.post('/login', (req, res) =>{
    const {email, password} = req.body; 

    if(email !== user.email || password !== user.password){
        return res.status(401).json({
            message: "Wrong email or password"
        })
    }

    const token = jwt.sign({
        email : user.email},
        JWT_SECRET,
        {expiresIn: "1h"}

    )

    res.json({
        message: "Log in successful",
        token: token
    })
})

// middleware
function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(401).json({
            message: "No token found"
        })
    }

    const token = authHeader;

    jwt.verify(token, JWT_SECRET, (err, userData) => {
        if(err){
            return res.status(403).json({ 
                message: "Invalid token" 
            });
        }

        req.user = userData;
        next();
    }); 
}


app.get('/profile', authenticateToken, (req, res) =>{
    res.json({
        message: "Access successful",
        user: req.user
    });
})


app.listen(3000)