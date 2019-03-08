
const express = require('express');

// Set up the express app
const app = express();
const PORT = 5000;
const mysql = require('mysql');
const pool = mysql.createPool ({
    connectionLimit : 10,
    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'bd5093cdc10674',
    password: '60272c99',
    database: 'heroku_e97bdfc7b2fa764',
});

// get users
app.get("/users/:id", (req,res) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    console.log("Devolviendo usuario con id: " + req.params.id)
    
    const userId = req.params.id

    //simulacion consulta en la db
    nombre = ""
    if (userId == 1){
        nombre = "Santiago"

    }else if (userId == 2){
        nombre = "Juan"
    }

    res.json(nombre)

    //res.end()
})

app.post("/adduser", (req, res) => {
    var subcription = req.body.subcription;
 
    if(subcription){
        pool.query('INSERT INTO usuario (usu_subs) VALUES(?)', [subcription], (err, rows, fields) => {
            if(err)
                throw err;
            else
                console.log('Subscription Success')
                res.send('Subscription Success')
                res.end()
        })
    }else{
        res.send('Please subs!');
        res.end();
    }
})


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});







