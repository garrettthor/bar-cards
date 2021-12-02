const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Cocktail = require('./models/cockail');
const { resourceLimits } = require('worker_threads');

mongoose.connect('mongodb://localhost/bar-cards', 
    { useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to database');
});



const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Home route

app.get('/', (req, res) => {
    res.render('home');
});

// Cocktails routes, CRUD operations

app.get('/cocktails', async (req, res) => {
    const cocktails = await Cocktail.find({});
    res.render('cocktails/index', { cocktails });
});

app.get('/cocktails/new', (req, res) => {
    res.render('cocktails/new');
});

app.post('/cocktails', async(req, res) => {
    const cocktail = new Cocktail(req.body.cocktail);
    await cocktail.save();
    res.redirect(`/cocktails/${cocktail._id}`);
});

app.get('/cocktails/:id', async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    res.render('cocktails/show', { cocktail });
});

app.get('/cocktails/:id/edit', async (req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    res.render('cocktails/edit', { cocktail });
});

app.put('/cocktails/:id', async (req, res) => {
    const { id } = req.params;
    const cocktail = await Cocktail.findByIdAndUpdate(id, req.body.cocktail);
    res.redirect(`/cocktails/${cocktail._id}`); 
});

app.delete('/cocktails/:id', async (req, res) => {
    const { id } = req.params;
    const cocktail = await Cocktail.findByIdAndDelete(id);
    res.redirect('/cocktails');
});

// Compendium routes, CRUD operations

app.get('/compendiums', (req, res) => {
    // const compendiums = await Compendium.find({});
    res.render('compendiums/index');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});