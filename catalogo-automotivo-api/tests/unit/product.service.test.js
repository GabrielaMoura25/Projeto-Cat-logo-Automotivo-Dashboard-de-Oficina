const productService = require('../../src/services/product.service');
const Product = require('../../src/models/product.model');
jest.mock('../../src/models/product.model');

describe('Product Service', () => {
  it('cria produto e retorna id', async () => {
    Product.create.mockResolvedValue(123);
    const id = await productService.criarProduto({
      nome: 'Teste',
      categoria: 'Teste',
    });
    expect(id).toBe(123);
  });

  it('propaga erro do model ao criar produto', async () => {
    Product.create.mockRejectedValue(new Error('DB error'));
    await expect(
      productService.criarProduto({ nome: 'Teste', categoria: 'Teste' })
    ).rejects.toThrow('DB error');
  });

  it('propaga erro do model ao listar produtos', async () => {
    Product.findAll.mockRejectedValue(new Error('DB error'));
    await expect(productService.listarProdutos()).rejects.toThrow('DB error');
  });

  it('propaga erro do model ao buscar produtos', async () => {
    Product.search.mockRejectedValue(new Error('DB error'));
    await expect(productService.buscarProdutos('Filtro')).rejects.toThrow(
      'DB error'
    );
  });

  it('propaga erro do model ao atualizar produto', async () => {
    Product.update.mockRejectedValue(new Error('DB error'));
    await expect(
      productService.atualizarProduto(1, { nome: 'Teste' })
    ).rejects.toThrow('DB error');
  });

  it('propaga erro do model ao buscar por id', async () => {
    Product.findById.mockRejectedValue(new Error('DB error'));
    await expect(productService.buscarPorId(1)).rejects.toThrow('DB error');
  });
});
