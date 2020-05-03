const express = require('express');
const jwt =  require('jsonwebtoken');
require('dotenv').config()

app = express();
app.use(express.json())

const posts = [
    {
        username:"Sam",
        age:"28",
        hoby:"reading"
    },
    {
        username:"Fenzy",
        age:"24",
        hoby:"reading"
    },
    {
        username:"Paul",
        age:"26",
        hoby:"working"
    },
]

function authenticateToken(req,res,next){

    let authHeader = req.headers.authorization;
    let token = authHeader.split(' ')[1]

    if(token == null) res.sendStatus(401)

    jwt.verify(token,process.env.ACCESS_TOKEN, (err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

app.get('/posts', authenticateToken, (req,res) =>{

    res.status(200).send(posts.filter(post => post.username === req.user.name))

});

app.post('/login',  (req,res) =>{

    let username = req.body.username;
    let user = {name:username}

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN);

    res.status(200).send({accessToken:accessToken})

})

app.listen(3000);
