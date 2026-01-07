const db = require('../database/connection');

const create = async (produto) => {
  try {
    const [result] = await db.execute(
      `INSERT INTO products (nome, categoria, marca, aplicacao_veicular, descricao) VALUES (?, ?, ?, ?, ?)`,
      [
        produto.nome,
        produto.categoria,
        produto.marca,
        produto.aplicacao_veicular,
        produto.descricao,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error('Erro ao criar produto no banco:', error);
    throw error;
  }
};

const findAll = async () => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM products ORDER BY criado_em DESC'
    );
    return rows;
  } catch (error) {
    console.error('Erro ao listar produtos no banco:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar produto por id no banco:', error);
    throw error;
  }
};

const search = async (q) => {
  try {
    const search = `%${q}%`;
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE nome LIKE ? OR categoria LIKE ? OR marca LIKE ? OR descricao LIKE ? OR aplicacao_veicular LIKE ? ORDER BY criado_em DESC`,
      [search, search, search, search, search]
    );
    return rows;
  } catch (error) {
    console.error('Erro ao buscar produtos no banco:', error);
    throw error;
  }
};

const update = async (id, produto) => {
  try {
    await db.execute(
      `UPDATE products SET nome = ?, categoria = ?, marca = ?, aplicacao_veicular = ?, descricao = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        produto.nome,
        produto.categoria,
        produto.marca,
        produto.aplicacao_veicular,
        produto.descricao,
        id,
      ]
    );
  } catch (error) {
    console.error('Erro ao atualizar produto no banco:', error);
    throw error;
  }
};

module.exports = { create, findAll, findById, search, update };
