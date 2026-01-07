jest.mock("../../src/database/connection", () => ({
    execute: jest.fn(),
}));

const db = require("../../src/database/connection");
const productModel = require("../../src/models/product.model");

describe("Product Model", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("insere produto e retorna insertId", async () => {
            db.execute.mockResolvedValue([{ insertId: 10 }]);

            const produto = {
                nome: "Filtro",
                categoria: "Motor",
                marca: "Bosch",
                aplicacao_veicular: "Gol",
                descricao: "desc",
            };

            const id = await productModel.create(produto);

            expect(db.execute).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO products"),
                [
                    produto.nome,
                    produto.categoria,
                    produto.marca,
                    produto.aplicacao_veicular,
                    produto.descricao,
                ]
            );

            expect(id).toBe(10);
        });

        it("loga erro e relança exceção", async () => {
            const error = new Error("DB error");
            jest.spyOn(console, "error").mockImplementation(() => {});
            db.execute.mockRejectedValue(error);

            await expect(
                productModel.create({})
            ).rejects.toThrow("DB error");

            expect(console.error).toHaveBeenCalledWith(
                "Erro ao criar produto no banco:",
                error
            );
        });
    });

    describe("findAll", () => {
        it("retorna lista de produtos", async () => {
            const rows = [{ id: 1 }, { id: 2 }];
            db.execute.mockResolvedValue([rows]);

            const result = await productModel.findAll();

            expect(db.execute).toHaveBeenCalledWith(
                "SELECT * FROM products ORDER BY criado_em DESC"
            );
            expect(result).toEqual(rows);
        });

        it("loga erro e relança exceção", async () => {
            const error = new Error("DB error");
            jest.spyOn(console, "error").mockImplementation(() => {});
            db.execute.mockRejectedValue(error);

            await expect(productModel.findAll()).rejects.toThrow("DB error");

            expect(console.error).toHaveBeenCalledWith(
                "Erro ao listar produtos no banco:",
                error
            );
        });
    });

    describe("findById", () => {
        it("retorna produto quando encontrado", async () => {
            const row = { id: 1 };
            db.execute.mockResolvedValue([[row]]);

            const result = await productModel.findById(1);

            expect(db.execute).toHaveBeenCalledWith(
                "SELECT * FROM products WHERE id = ?",
                [1]
            );
            expect(result).toEqual(row);
        });

        it("retorna null quando não encontrado", async () => {
            db.execute.mockResolvedValue([[]]);

            const result = await productModel.findById(999);

            expect(result).toBeNull();
        });

        it("loga erro e relança exceção", async () => {
            const error = new Error("DB error");
            jest.spyOn(console, "error").mockImplementation(() => {});
            db.execute.mockRejectedValue(error);

            await expect(productModel.findById(1)).rejects.toThrow("DB error");

            expect(console.error).toHaveBeenCalledWith(
                "Erro ao buscar produto por id no banco:",
                error
            );
        });
    });

    describe("search", () => {
        it("busca produtos usando LIKE", async () => {
            const rows = [{ id: 1 }];
            db.execute.mockResolvedValue([rows]);

            const result = await productModel.search("filtro");

            expect(db.execute).toHaveBeenCalledWith(
                expect.stringContaining("LIKE ?"),
                [
                    "%filtro%",
                    "%filtro%",
                    "%filtro%",
                    "%filtro%",
                    "%filtro%",
                ]
            );

            expect(result).toEqual(rows);
        });

        it("loga erro e relança exceção", async () => {
            const error = new Error("DB error");
            jest.spyOn(console, "error").mockImplementation(() => {});
            db.execute.mockRejectedValue(error);

            await expect(productModel.search("x")).rejects.toThrow("DB error");

            expect(console.error).toHaveBeenCalledWith(
                "Erro ao buscar produtos no banco:",
                error
            );
        });
    });

    describe("update", () => {
        it("atualiza produto com sucesso", async () => {
            db.execute.mockResolvedValue();

            const produto = {
                nome: "Filtro",
                categoria: "Motor",
                marca: "Bosch",
                aplicacao_veicular: "Gol",
                descricao: "desc",
            };

            await productModel.update(1, produto);

            expect(db.execute).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE products SET"),
                [
                    produto.nome,
                    produto.categoria,
                    produto.marca,
                    produto.aplicacao_veicular,
                    produto.descricao,
                    1,
                ]
            );
        });

        it("loga erro e relança exceção", async () => {
            const error = new Error("DB error");
            jest.spyOn(console, "error").mockImplementation(() => {});
            db.execute.mockRejectedValue(error);

            await expect(
                productModel.update(1, {})
            ).rejects.toThrow("DB error");

            expect(console.error).toHaveBeenCalledWith(
                "Erro ao atualizar produto no banco:",
                error
            );
        });
    });
});
