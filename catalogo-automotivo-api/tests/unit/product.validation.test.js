const {
  produtoSchema,
  produtoUpdateSchema,
} = require('../../src/utils/product.validation');

describe('Validação de Produto (Joi)', () => {
  it('valida produto válido', () => {
    const result = produtoSchema.validate({
      nome: 'Filtro de Óleo',
      categoria: 'Filtros',
      marca: 'Fram',
      aplicacao_veicular: 'Gol G6 1.6 2014+',
    });
    expect(result.error).toBeUndefined();
  });

  it('rejeita produto sem nome', () => {
    const result = produtoSchema.validate({ categoria: 'Filtros' });
    expect(result.error).toBeDefined();
  });

  it('valida update parcial', () => {
    const result = produtoUpdateSchema.validate({ marca: 'NGK' });
    expect(result.error).toBeUndefined();
  });

  it('rejeita update vazio', () => {
    const result = produtoUpdateSchema.validate({});
    expect(result.error).toBeDefined();
  });
});
