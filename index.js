const express = require(`express`);
const app = express();
const path = require (`path`);
const { v4: uuidv4 } = require('uuid'); 
const methodOverride = require(`method-override`); 
const mongoose = require('mongoose');
const Product = require('./models/product');


//connect monggose
mongoose.connect(`mongodb://127.0.0.1/shop_db`)
.then((result) =>{
    console.log("connect to mongodb")
}) .catch((err) => {
    console.log(err);
});




app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(methodOverride(`_method`));

app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `ejs`);


const auth = (req, res, next) => {
    const { via } = req.query || {};
    if (via === "ordal") {
        next();
    } else {
        res.send("Tidak Bisa diakses");
    }
};

//route path

app.get(`/`, (req, res) => {
    res.send("Mongodb")
});

app.get(`/product`, async (req, res) => {
    const {category} = req.query;

    if(category) {
    const product = await Product.find({ category })
    res.render("products/index", { product, category })
} else {
    const product = await Product.find({});
    res.render("products/index", {product, category: "All"});
}
    
});

app.get(`/product/create`,  (req, res) => {
    res.render("products/create");

    
});

// app.get(`/product/khusus`, auth, async (req, res) => {
//     const product = await Product.find({});
//     res.render("products/khusus", {product});
// });


app.get('/product/khusus', auth, async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products/khusus', { products });
    } catch (error) {
        res.status(500).send('Error retrieving products');
    }
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

app.get(`/product/:id/edit`,  async (req, res) => {
    const { id } = req.params;
    try { const product = await Product.findById(id);
    if (!product) {
        console.log(`Product with ID ${id} not found`);
        return res.status(404).send('Product not found');
    }
    res.render("products/edit", { product });
} catch (err) {
    console.log(`Error finding product with ID ${id}:`, err);
    res.status(500).send('Something went wrong');
}
});

app.put(`/product/:id`,  async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true});
    res.redirect(`${product._id}`);

    
});

app.delete(`/product/:id`,  async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/product");

    
});

// app.get(`*`, (req, res) => {
//     res.send("Salah")
// });




app.listen(3000, () => {
    console.log("Server is running on http://127.0.0.1:3000")

});