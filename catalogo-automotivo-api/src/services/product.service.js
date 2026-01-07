const Product = require('../models/product.model');

const criarProduto = async (produto) => {
  try {
    return await Product.create(produto);
  } catch (error) {
    console.error('Erro no service ao criar produto:', error);
    throw error;
  }
};

const listarProdutos = async () => {
  try {
    return await Product.findAll();
  } catch (error) {
    console.error('Erro no service ao listar produtos:', error);
    throw error;
  }
};

const buscarProdutos = async (q) => {
  try {
    return await Product.search(q);
  } catch (error) {
    console.error('Erro no service ao buscar produtos:', error);
    throw error;
  }
};

const atualizarProduto = async (id, produto) => {
  try {
    await Product.update(id, produto);
  } catch (error) {
    console.error('Erro no service ao atualizar produto:', error);
    throw error;
  }
};

const buscarPorId = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    console.error('Erro no service ao buscar produto por id:', error);
    throw error;
  }
};

module.exports = {
  criarProduto,
  listarProdutos,
  buscarProdutos,
  atualizarProduto,
  buscarPorId,
};
