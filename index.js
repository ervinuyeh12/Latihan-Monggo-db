const express = require(`express`);
const app = express();
const path = require (`path`);
const { v4: uuidv4 } = require('uuid'); 
const methodOverride = require(`method-override`); 
const mongoose = require('mongoose');


//models
const Product = require('./models/product');
const Garment = require('./models/garment');

const ErrorHandler = require(`./ErrorHandler`);


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

//Autentifikasi

const auth = (req, res, next) => {
    const { via } = req.query || {};
    if (via === "ordal") {
        next();
    } else { 
        res.send("Tidak Bisa diakses");
    }
};

function warpAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
};


app.get(`/`, (req, res) => {
    res.send("Mongodb")
});

//PRODUK

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

app.get(`/product/createP`,  (req, res) => {
    res.render("products/createP");

    
});

app.post(`/product`, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect("/product")
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

app.get(`/product/:id`,  async (req, res, next) => {
    const { id } = req.params;
    try{
        const product = await Product.findById(id).populate("garment");
        res.render("products/show", {product})
     

    } catch (err){
        // error handler
        next(new ErrorHandler("id salah tidak dapat diakses", 404))

    }
    
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

// Garments

app.get(`/garments`, warpAsync(async(req, res) => {
    const garments = await Garment.find({});
    res.render("garment/index", { garments})
}));

app.get(`/garments/create`,  (req, res) => {
    res.render("garment/create");

    
});



// pake mongosh beda mase
app.post(`/garments`, async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    res.redirect("/garments")
});



// app.get(`*`, (req, res) => {
//     res.send("Salah")
// });

app.get(`/garments/:id`,  async (req, res, next) => {
    const { id } = req.params;
    try{
        const garment = await Garment.findById(id).populate("products");
        res.render("garment/show", {garment});

    } catch (err){
        // error handler
        next(new ErrorHandler("id salah tidak dapat diakses", 404))

    }
    
});

//membuat garment dan product baru sekaligus

app.get(`/garments/:garment_id/product/create`, (req, res) => {
    const { garment_id} = req.params;
    res.render("products/create", {garment_id})
});

app.post(`/garments/:garment_id/product`, warpAsync(async(req, res) => {
    const { garment_id} = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);
    garment.products.push(product)
    product.garment = garment;
    await garment.save()
    await product.save()

    res.redirect(`/garments/${garment_id}`)
}));


app.delete(`/garments/:garment_id/`,  async (req, res) => {
    const { garment_id } = req.params;
    await Garment.findOneAndDelete({_id: garment_id});
    res.redirect("/garments");

    
});

// ini taruh paling belakang aja
app.use((err, req, res, next) => {
     const { status = 400, message = `something went wrong!`} = err;
    res.status(status).send(message);

 });


app.listen(3000, () => {
    console.log("Server is running on http://127.0.0.1:3000")

});