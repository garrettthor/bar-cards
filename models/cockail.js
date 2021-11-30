const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CocktailSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    ing1: String,
    ing2: String,
    ing3: String,
    ing4: String,
    ing5: String,
    ing6: String,
    ing7: String,
    ing8: String,
    ing9: String,
    ing10: String,
    glass: String,
    garnish: String,
    image: String,
    instructions: String,
});

module.exports = mongoose.model('Cocktail', CocktailSchema); 