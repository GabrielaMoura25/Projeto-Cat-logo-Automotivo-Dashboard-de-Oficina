const productService = require('../services/product.service');
const { gerarDescricaoComRetry } = require('../services/ai.service');
const {
  produtoSchema,
  produtoUpdateSchema,
} = require('../utils/product.validation');

const criarProduto = async (req, res) => {
  try {
    const { error, value } = produtoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let descricao = await gerarDescricaoComRetry(value.nome, value.categoria);
    if (!descricao) descricao = '';

    const produto = { ...value, descricao };
    const id = await productService.criarProduto(produto);
    return res.status(201).json({ message: 'Produto criado com sucesso', id });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ message: 'Erro ao criar produto' });
  }
};

const listarProdutos = async (_, res) => {
  try {
    const produtos = await productService.listarProdutos();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};

const buscarProdutos = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: 'Parâmetro de busca "q" é obrigatório' });
    }
    const produtos = await productService.buscarProdutos(q);
    return res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro na busca de produtos:', error);
    return res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};

const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = produtoUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existente = await productService.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    let descricao = existente.descricao || '';
    // Só chama IA se nome ou categoria forem alterados
    const nomeFinal = value.nome !== undefined ? value.nome : existente.nome;
    const categoriaFinal =
      value.categoria !== undefined ? value.categoria : existente.categoria;
    if (
      (value.nome && value.nome !== existente.nome) ||
      (value.categoria && value.categoria !== existente.categoria)
    ) {
      const novaDescricao = await gerarDescricaoComRetry(
        nomeFinal,
        categoriaFinal
      );
      if (novaDescricao) descricao = novaDescricao;
    }
    const produto = {
      nome: nomeFinal,
      categoria: categoriaFinal,
      marca: value.marca !== undefined ? value.marca : existente.marca,
      aplicacao_veicular:
        value.aplicacao_veicular !== undefined
          ? value.aplicacao_veicular
          : existente.aplicacao_veicular,
      descricao,
    };
    await productService.atualizarProduto(id, produto);
    return res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
};

module.exports = {
  criarProduto,
  listarProdutos,
  buscarProdutos,
  atualizarProduto,
};
