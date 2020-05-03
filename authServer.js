const express = require('express');
const jwt =  require('jsonwebtoken');
require('dotenv').config()

app = express();
app.use(express.json())

let refreshTokens = [];

app.post('/token',(req,res)=>{

    let refreshToken = req.body.token;

    if(refreshToken == null) return res.sendStatus(401)

    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN, (err,user)=>{

        if(err) return res.sendStatus(403)

        const accessToken = generateAccessToken({name:user.name})

        res.json({
            accessToken:accessToken
        })


    })

})

app.post('/login',  (req,res) =>{

    let username = req.body.username;
    let user = {name:username}
    let accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN);

    refreshTokens.push(refreshToken);
    
    res.status(200).send({
        accessToken:accessToken,
        refreshToken:refreshToken
    })

})

function generateAccessToken(user){
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN, {expiresIn:'15s'});
    return accessToken;

}

app.listen(4000);
