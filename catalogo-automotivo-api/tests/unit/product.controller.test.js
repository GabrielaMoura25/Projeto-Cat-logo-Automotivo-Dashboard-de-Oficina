const {
  criarProduto,
  listarProdutos,
  buscarProdutos,
  atualizarProduto,
} = require('../../src/controllers/product.controller');

const productService = require('../../src/services/product.service');
const aiService = require('../../src/services/ai.service');

jest.mock('../../src/services/product.service');
jest.mock('../../src/services/ai.service');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Product Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criarProduto', () => {
    it('retorna 400 se validação falhar', async () => {
      const req = { body: {} };
      const res = mockRes();

      await criarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('cria produto com descrição da IA', async () => {
      const req = {
        body: {
          nome: 'Filtro de Óleo',
          categoria: 'Motor',
          marca: 'Bosch',
          aplicacao_veicular: 'Gol',
        },
      };
      const res = mockRes();

      aiService.gerarDescricaoComRetry.mockResolvedValue('Descrição IA');
      productService.criarProduto.mockResolvedValue(1);

      await criarProduto(req, res);

      expect(productService.criarProduto).toHaveBeenCalledWith(
        expect.objectContaining({ descricao: 'Descrição IA' })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('cria produto com descrição vazia se IA retornar null', async () => {
      const req = {
        body: {
          nome: 'Filtro',
          categoria: 'Motor',
          marca: 'Bosch',
          aplicacao_veicular: 'Gol',
        },
      };
      const res = mockRes();

      aiService.gerarDescricaoComRetry.mockResolvedValue(null);
      productService.criarProduto.mockResolvedValue(1);

      await criarProduto(req, res);

      expect(productService.criarProduto).toHaveBeenCalledWith(
        expect.objectContaining({ descricao: '' })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('retorna 500 em erro inesperado', async () => {
      const req = {
        body: {
          nome: 'Filtro',
          categoria: 'Motor',
          marca: 'Bosch',
          aplicacao_veicular: 'Gol',
        },
      };
      const res = mockRes();

      productService.criarProduto.mockRejectedValue(new Error('DB error'));

      await criarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('listarProdutos', () => {
    it('retorna lista de produtos', async () => {
      const res = mockRes();
      productService.listarProdutos.mockResolvedValue([{ id: 1 }]);

      await listarProdutos({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('retorna 500 em erro', async () => {
      const res = mockRes();
      productService.listarProdutos.mockRejectedValue(new Error());

      await listarProdutos({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('buscarProdutos', () => {
    it('retorna 400 se q não for informado', async () => {
      const req = { query: {} };
      const res = mockRes();

      await buscarProdutos(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retorna produtos buscados', async () => {
      const req = { query: { q: 'filtro' } };
      const res = mockRes();

      productService.buscarProdutos.mockResolvedValue([{ id: 1 }]);

      await buscarProdutos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it('retorna 500 em erro', async () => {
      const req = { query: { q: 'filtro' } };
      const res = mockRes();

      productService.buscarProdutos.mockRejectedValue(new Error());

      await buscarProdutos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('atualizarProduto', () => {
    it('retorna 400 se validação falhar', async () => {
      const req = { params: { id: 1 }, body: {} };
      const res = mockRes();

      await atualizarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retorna 404 se produto não existir', async () => {
      const req = { params: { id: 1 }, body: { nome: 'Novo' } };
      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(null);

      await atualizarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('atualiza produto sem chamar IA', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: { marca: 'Nova' },
      };
      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(aiService.gerarDescricaoComRetry).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('atualiza produto chamando IA quando nome muda', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: { nome: 'Filtro Novo' },
      };
      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      aiService.gerarDescricaoComRetry.mockResolvedValue('Nova desc');
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(aiService.gerarDescricaoComRetry).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('retorna 500 em erro inesperado', async () => {
      const req = { params: { id: 1 }, body: { nome: 'Novo' } };
      const res = mockRes();

      productService.buscarPorId.mockRejectedValue(new Error());

      await atualizarProduto(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('usa descrição vazia quando produto existente não tem descrição', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: undefined,
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: { marca: 'Nova Marca' },
      };

      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(productService.atualizarProduto).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ descricao: '' })
      );
    });

    it('chama IA quando categoria é alterada', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc antiga',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: { categoria: 'Suspensão' },
      };

      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      aiService.gerarDescricaoComRetry.mockResolvedValue('Nova descrição');
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(aiService.gerarDescricaoComRetry).toHaveBeenCalledWith(
        'Filtro',
        'Suspensão'
      );

      expect(productService.atualizarProduto).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ descricao: 'Nova descrição' })
      );
    });

    it('mantém descrição antiga quando IA retorna null após mudar categoria', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc antiga',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: { categoria: 'Suspensão' },
      };

      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      aiService.gerarDescricaoComRetry.mockResolvedValue(null);
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(productService.atualizarProduto).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ descricao: 'desc antiga' })
      );
    });

    it('mantém aplicacao_veicular existente quando não enviado no body', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: { nome: 'Filtro' },
      };

      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(productService.atualizarProduto).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          aplicacao_veicular: 'Gol',
        })
      );
    });

    it('usa aplicacao_veicular existente quando o campo é enviado como undefined', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: {
          nome: 'Filtro',
          aplicacao_veicular: undefined,
        },
      };

      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(productService.atualizarProduto).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          aplicacao_veicular: 'Gol',
        })
      );
    });

    it('usa aplicacao_veicular null quando o campo é enviado como null', async () => {
      const existente = {
        nome: 'Filtro',
        categoria: 'Motor',
        descricao: 'desc',
        marca: 'Bosch',
        aplicacao_veicular: 'Gol',
      };

      const req = {
        params: { id: 1 },
        body: {
          nome: 'Filtro',
          aplicacao_veicular: null,
        },
      };

      const res = mockRes();

      productService.buscarPorId.mockResolvedValue(existente);
      productService.atualizarProduto.mockResolvedValue();

      await atualizarProduto(req, res);

      expect(productService.atualizarProduto).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          aplicacao_veicular: null,
        })
      );
    });
  });
});
