const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyparser = require("body-parser")
const http = require("http")
const app = express()

const cookieParser = require('cookie-parser');
app.use(cookieParser())

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));


// app.use(cors({ origin: ['https://adminside-project-p.onrender.com','http://localhost:5173'], 
// // credentials: true ,
// // methods: ['GET','POST','DELETE','OPTIONS' ],
// // allowedHeaders:[
// //     'Access-Control-Allow-Origin',
// //     'Content-Type',
// //     'Authorization',
// // ],
// })); 
app.use(cors())

// app.set("trust proxy", 1);
// app.use(cors())


const serverstart = http.createServer(app)

//----------------------------------------connecting all routers-----------------------------------
const biorouter = require("./zcomponents/biography")
const aboutrouter = require("./zcomponents/aboutsection")
const activityrouter = require("./zcomponents/activitysection")
const blogrouter = require('./zcomponents/blogsection')
const herorouter = require('./zcomponents/herosection')
//-------------------------------------------------------------------------------------------------
const DataModel = require("./main/mongoconnect")

// mongoose.connect("mongodb://localhost/newone").then(() => console.log("mongoose connected"))

mongoose.connect("mongodb+srv://thejusjoseph:dwMMlpOhly7HFKgx@cluster0.2mkkvws.mongodb.net/test?retryWrites=true&w=majority").then(() => console.log("mongoose connected"))


app.get('/', async (req, res) => {
    const alldata = await DataModel.find()
    // res.json(alldata)
})
app.post("/", async (req, res) => {
    const fulldata = req.body
    // console.log(fulldata)
    const sdata = new DataModel(fulldata)
    await sdata.save()
    res.send("yesss")
})


//----------------------------------------------------Login and Verify Part----------------------------------------------

// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./main/usersmongo');
const { env } = require("process")


app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        // Find user by name
        const user = await User.findOne({ name });
        // console.log(user)
        if (!user) {
            return res.json({ message: 'Invalid name or password' });
        }
        // Compare passwords
        const match = user.password === password;
        if (!match) {
            return res.json({ message: 'Invalid name or password' });
        }

        // const expirationTime = Math.floor(Date.now() / 1000) + (60 * 60);
        const expirationTime = Math.floor(Date.now() / 1000) + 10; // Current time + 10 seconds
        // console.log(expirationTime)
        // Generate token
        const token = jwt.sign({ userId: user._id }, 'x6dc003akf1', { expiresIn: 12 * 60 * 60 });
        // Set cookie with token
        // res.cookie('token', token, { maxAge: 7200000 ,
        //     path:'/edit',
        //     // secure:true,
        //     httpOnly:true,
        //     secure: env.ENVIRONMENT === 'LIVE',
        //     sameSite: env.ENVIRONMENT === 'LIVE' ? 'none' : 'lax',
        // }); //two hours 7200000

        // console.log("login side"+token)


        res.status(200).json({ message: 'Login successful', success: 1, token: token });
        //new change due to server error
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/verifytoken', async (req, res) => {
    const jwttoken = req.headers.authorization
    // console.log("cookie in verfy \n"+jwttoken)
    try {
        if (!jwttoken) {
            return res.send("error")
        }
        // console.log("cookie in verfy \n" + jwttoken)
        const user = jwt.verify(jwttoken, 'x6dc003akf1')
        // console.log(user)
        res.json({ user: user, message: 'success' })
    }
    catch (err) {
        // console.log("error in verification")
        res.send('error');
    }
})


// app.get('/logout', async (req, res) => {
//     res.clearCookie('token')
//     res.send("cookie cleared")
// })
//------------------------------------------------------------------------------------------------------------------


app.use('/', biorouter)
app.use('/', aboutrouter)
app.use('/', activityrouter)
app.use('/', blogrouter)
app.use('/', herorouter)



serverstart.listen(5000, () => { console.log("server started") })
