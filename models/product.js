const mongoose = require(`mongoose`);


const productSchema = new mongoose.Schema({
    id: {
        type: String,
        require : true


},   name: {
        type: String,
        require : true
}, 
    brand: {
        type: String,
        require : true

},
    price: {
        type: Number,
        require : true 
}, 
    color: {
        type: String,
        require : true 
}, 
    size: {
        type: String,
        enum: ["S", "M", "L"]
}
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;