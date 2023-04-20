const express = require('express');
const app = express();
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

//database
let products = [
    { id: 1, nimi: 'BMW', vuosimalli: 2017, kuutio: 250, kilometrit: 19000, ajetuttunnit: null, price: 4500},
    { id: 2, nimi: 'KTM', vuosimalli: 2020, kuutio: 50, kilometrit: null, ajetuttunnit: 20, price: 2200},
    { id: 3, nimi: 'Husqvarna', vuosimalli: 2021, kuutio: 65, kilometrit: null, ajetuttunnit: 35, price: 3300}
];

//list all products
app.get('/api/products',(req,res) => {
    res.json(products);
});

//get one
app.get('/api/products/:id', (req,res) => {
    const id = Number(req.params.id);
    const product = products.find(product => product.id === id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json(
            {
                msg: 'Not found'
            }
        )
    }   
    //res.json(product);
});

//delete
app.delete('/api/products/:id', (req,res) => {
    const id = Number(req.params.id);
    products = products.filter(product => product.id !== id);
    res.json(products);
});

//create
app.post('/api/products', (req,res) => {
    if (!req.body.name || !req.body.price) {
        res.status(400).json(
            { msg: 'Joku tiedoista puuttuu'}
        )
       }
       else {
        const newId = products[products.length-1].id + 1;

        const newProduct = {
            id: newId,
            nimi: req.body.nimi,
            vuosimalli: req.body.vuosimalli,
            kuutio: req.body.kuutio,
            kilometrit: req.body.kilometrit,
            ajetuttunnit: req.body.ajetuttunnit,
            price: req.body.price
        }
        products.push(newProduct);
        const url =`${req.protocol}://${req.get('host')}${req.originalUrl}/${newId}`;
        res.location(url);
        res.status(201).json(newProduct);

       }  
});

//update
app.patch('/api/products/:id', (req,res) => {
    const idToUpdate = Number(req.params.id);
    const newNimi = req.body.nimi;
    const newVuosimalli = req.body.vuosimalli;
    const newKuutio = req.body.kuutio;
    const newKilometrit = req.body.kilometrit;
    const newAjetuttunnit = req.body.ajetuttunnit;
    const newPrice = req.body.price
    products.forEach(product => {
        if (product.id === idToUpdate) {
            product.nimi = newNimi;
            product.vuosimalli = newVuosimalli;
            product.kuutio = newKuutio;
            product.kilometrit = newKilometrit;
            product.ajetuttunnit = newAjetuttunnit;
            product.price = newPrice;
        }
        
    });
    res.json(products);
});

//handlebars
app.get('/products', (req,res) => {
    res.render('products',
    {
        pagetitle : "Products",
        products : products
     });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));