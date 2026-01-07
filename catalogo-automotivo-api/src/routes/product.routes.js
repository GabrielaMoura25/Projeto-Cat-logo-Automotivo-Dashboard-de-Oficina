const express = require("express");
const router = express.Router();
const { criarProduto, listarProdutos, buscarProdutos, atualizarProduto } = require("../controllers/product.controller");

router.post("/products", criarProduto);
router.get("/products", listarProdutos);
router.get("/products/search", buscarProdutos);
router.put("/products/:id", atualizarProduto);

module.exports = router;
