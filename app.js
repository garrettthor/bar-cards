const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const CatchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/expressError');
const methodOverride = require('method-override');
const Cocktail = require('./models/cockail');
const Compendium = require('./models/compendium');
const { validateCocktailSchema } = require('./schemas.js');


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

const validateCocktail = (req, res, next) => {
        const { error } = validateCocktailSchema.validate(req.body);
        if(error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        };
};


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

app.post('/cocktails', validateCocktail, CatchAsync(async(req, res, next) => {
        // if(!req.body.cocktail) throw new ExpressError('Invalid Cocktail Data', 400);

    const cocktail = new Cocktail(req.body.cocktail);
    await cocktail.save();
    res.redirect(`/cocktails/${cocktail._id}`);
}));

app.get('/cocktails/:id', CatchAsync(async(req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    const compendiums = await Compendium.find({});
    res.render('cocktails/show', { cocktail, compendiums });
}));

app.get('/cocktails/:id/edit', CatchAsync(async(req, res) => {
    const cocktail = await Cocktail.findById(req.params.id);
    res.render('cocktails/edit', { cocktail });
}));

app.put('/cocktails/:id', CatchAsync(async(req, res) => {
    const { id } = req.params;
    const cocktail = await Cocktail.findByIdAndUpdate(id, req.body.cocktail);
    res.redirect(`/cocktails/${cocktail._id}`); 
}));

app.delete('/cocktails/:id', CatchAsync(async(req, res) => {
    const { id } = req.params;
    const cocktail = await Cocktail.findByIdAndDelete(id);
    res.redirect('/cocktails');
}));



// Compendium routes, CRUD operations

app.get('/compendiums', CatchAsync(async(req, res) => {
    const compendiums = await Compendium.find({});
    res.render('compendiums/index', { compendiums });
}));

app.get('/compendiums/new', (req, res) => {
    res.render('compendiums/new');
});

app.post('/compendiums', CatchAsync(async(req, res) => {
    if(!req.body.compendium) throw new ExpressError('Invalid Compendium Data', 400);
    const compendium = new Compendium(req.body.compendium);
    await compendium.save();
    res.redirect(`/compendiums/${compendium._id}`);
}));

app.get('/compendiums', CatchAsync(async(req, res) => {
    const compendiums = await Compendium.find({});
    res.render('compendiums/show', { compendiums });
}));

app.get('/compendiums/:id', CatchAsync(async(req, res) => {
    const compendium = await Compendium.findById(req.params.id);
    res.render('compendiums/show', { compendium });
}));

app.get('/compendiums/:id/edit', CatchAsync(async(req, res) => {
    const compendium = await Compendium.findById(req.params.id);
    res.render('compendiums/edit', { compendium });
}));

app.put('/compendiums/:id', CatchAsync(async(req, res) => {
    const { id } = req.params;
    const compendium = await Compendium.findByIdAndUpdate(id, req.body.compendium);
    res.redirect(`/compendiums/${compendium._id}`); 
}));

app.delete('/compendiums/:id', CatchAsync(async(req, res) => {
    const { id } = req.params;
    const compendium = await Compendium.findByIdAndDelete(id);
    res.redirect('/compendiums');
}));

// Adding cocktails to compendiums, etc

app.post('/compendiums/:id/addCocktail', CatchAsync(async(req, res) => {
    const compendium = document.querySelector('#compendium-selection')
    const cocktail = await Cocktail.findById(req.body.cocktailId);
    console.log(compendium);
    console.log(cocktail);
    // await compendium.cocktails.push(cocktail);
    // await compendium.save();
    res.redirect(`/compendiums/${compendium._id}`);
}));

// Error Handling

app.all('*', (req, res, next) => {
    // res.send('404!');
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if(!err.message) err.message = 'Oh dang, something done goofed!';
    res.status(statusCode).render('error', { err });
    // res.send('WHOOPSIES! We have a problem!');
});

// Hey, listen, lady!

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});