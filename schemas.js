const Joi = require('joi');

module.exports.validateCocktailSchema = Joi.object({
        cocktail: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().required().min(0),
            ing1: Joi.string().allow(''),
            ing2: Joi.string().allow(''),
            ing3: Joi.string().allow(''),
            ing4: Joi.string().allow(''),
            ing5: Joi.string().allow(''),
            ing6: Joi.string().allow(''),
            ing7: Joi.string().allow(''),
            ing8: Joi.string().allow(''),
            ing9: Joi.string().allow(''),
            ing10: Joi.string().allow(''),
            instructions: Joi.string().required(),
            glass: Joi.string().required(),
            garnish: Joi.string().allow(''),
            image: Joi.string().required()
        }).required(),
});