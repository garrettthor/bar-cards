const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compendiumSchema = new Schema({
    name: String,
    description: String,
    owner: String,
    created: {   
        type: Date, 
        default: Date.now 
        },
    accessList: [String],
    color: String,
    cocktails: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cocktail'
        }
    ]
});

module.exports = mongoose.model('Compendium', compendiumSchema);