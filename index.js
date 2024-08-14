const express = require(`express`);
const app = express();
const path = require (`path`);
const { v4: uuidv4 } = require('uuid'); 
// const methodOverride = require(`method-override`); 
const mongoose = require('mongoose');
const Product = require('./models/product');


//connect monggose
mongoose.connect(`mongodb://127.0.0.1/shop_db`)
.then((result) =>{
    console.log("connect to mongodb")
}) .catch((err) => {
    console.log(err);
});


// // Connect to MongoDB (untuk remove duplicate)
// mongoose.connect(`mongodb://127.0.0.1/shop_db`)
//     .then(() => {
//         console.log("Connected to MongoDB");
//         removeDuplicates();
//     })
//     .catch(err => {
//         console.log("Failed to connect to MongoDB:", err);
//     });

// async function removeDuplicates() {
//     try {
//         const products = await Product.find({});
//         const seen = new Set();

//         for (const product of products) {
//             const identifier = `${product.name}-${product.brand}`;
            
//             if (seen.has(identifier)) {
//                 // Hapus produk duplikat
//                 await Product.findByIdAndDelete(product._id);
//                 console.log(`Duplicate removed: ${product.name} - ${product.brand}`);
//             } else {
//                 seen.add(identifier);
//             }
//         }

//         console.log("Duplicate removal completed.");
//         mongoose.connection.close();
//     } catch (err) {
//         console.log("Error during duplicate removal:", err);
//     }
// }


app.use(express.urlencoded({extended: true}));

app.use(express.json());

// app.use(methodOverride(`_method`));

app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);


//route path

app.get(`/`, (req, res) => {
    res.send("Mongodb")
});

app.get(`/product`, async (req, res) => {
    const product = await Product.find({});
    
    res.render("products/index", {product});

    
});

app.get(`/product/create`,  (req, res) => {
    res.render("products/create");

    
});


// pake mongosh beda mase
app.post(`/product`, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect("/product")
});

app.get(`/product/:id`,  async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show", {product});

    
});


// app.get(`*`, (req, res) => {
//     res.send("Salah")
// });




app.listen(3000, () => {
    console.log("Server is running on http://127.0.0.1:3000")

});