const Joi = require("joi");

const produtoSchema = Joi.object({
    nome: Joi.string().min(2).max(100).required(),
    categoria: Joi.string().min(2).max(100).required(),
    marca: Joi.string().max(100).allow(null, ""),
    aplicacao_veicular: Joi.string().max(200).allow(null, ""),
});

const produtoUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(100),
    categoria: Joi.string().min(2).max(100),
    marca: Joi.string().max(100).allow(null, ""),
    aplicacao_veicular: Joi.string().max(200).allow(null, ""),
}).min(1);

module.exports = { produtoSchema, produtoUpdateSchema };
