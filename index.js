const express = require(`express`);
const app = express();
const path = require (`path`);
// const { v4: uuidv4 } = require('uuid'); 
// const methodOverride = require(`method-override`); 
const mongoose = require('mongoose');


//connect monggose
mongoose.connect(`mongodb://127.0.0.1/shop_db`)
.then((result) =>{
    console.log("connect to mongodb")
}) .catch((err) => {
    console.log(err);
});

// app.use(express.urlencoded({extended: true}));

// app.use(express.json());

// app.use(methodOverride(`_method`));

app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);


//route path

app.get(`/`, (req, res) => {
    res.send("Mongodb")
});

app.get(`*`, (req, res) => {
    res.send("Salah")
});




app.listen(3000, () => {
    console.log("Server is running on http://127.0.0.1:3000")

});