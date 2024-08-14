const mongoose = require('mongoose');

// models
const product = require(`./models/product`);

const { v4: uuidv4 } = require('uuid'); 

//connect monggose
mongoose.connect(`mongodb://127.0.0.1/shop_db`)
.then((result) =>{
    console.log("connect to mongodb")
}) .catch((err) => {
    console.log(err);
});

const seedProducts = 
    [
        {
            "id": uuidv4(),
            "name": "Kemeja Flanel",
            "brand": "Hollister",
            "price": 750000,
            "color": "biru muda",
            "size": "L"
           
        },
       
        {
            "id": uuidv4(),
            "name": "Sweater",
            "brand": "Gap",
            "price": 650000,
            "color": "merah muda",
            "size": "M"
           
        },
        {
            "id": uuidv4(),
            "name": "Sepatu Sneakers",
            "brand": "Nike",
            "price": 1200000,
            "color": "putih",
            "size": "L"
            
        },
        {
            "id": uuidv4(),
            "name": "Tas Ransel",
            "brand": "Herschel",
            "price": 1500000,
            "color": "biru",
            "size": "S"
            
        },
        {
            "id": uuidv4(),
            "name": "Kacamata Aviator",
            "brand": "Ray-Ban",
            "price": 2000000,
            "color": "emas",
            "size": "M"
           
        },
        {
            "id": uuidv4(),
            "name": "Baju Renang",
            "brand": "Speedo",
            "price": 500000,
            "color": "biru tua",
            "size": "S"
           
            
        },
        {
            "id": uuidv4(),
            "name": "Topi Baseball",
            "brand": "New Era",
            "price": 350000,
            "color": "hitam",
            "size": "S"
            
        },
        {
            "id": uuidv4(),
            "name": "Rompi",
            "brand": "Zara",
            "price": 850000,
            "color": "abu-abu",
            "size": "L"
            
        },
        {
            "id": uuidv4(),
            "name": "Jas",
            "brand": "Hugo Boss",
            "price": 4500000,
            "color": "hitam",
            "size": "S"
           
            
        }
       
 ]

 product.insertMany(seedProducts)
 .then((result) => {
    console.log(result)
 }) .catch((err) => {
    console.log(err)
 })


 console.log(product.find({}));