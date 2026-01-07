const aiService = require("../../src/services/ai.service");

describe("AI Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("retorna null se não houver chave de API", async () => {
        process.env.GEMINI_API_KEY = "";
        jest.resetModules();

        const { gerarDescricao } = require("../../src/services/ai.service");

        const result = await gerarDescricao("Produto", "Categoria");
        expect(result).toBeNull();
    });

    it("timeout em gerarDescricaoComRetry retorna null", async () => {
        jest.spyOn(aiService, "gerarDescricao")
            .mockRejectedValueOnce(new Error("Timeout IA"));

        const result = await aiService.gerarDescricaoComRetry(
            "Produto",
            "Categoria",
            1,
            10
        );

        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });

    it("retorna response.text() quando for função", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => ({
                    response: { text: () => "texto função" },
                }),
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBe("texto função");
    });

    it("retorna response.text quando for string", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => ({
                    response: { text: "texto string" },
                }),
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBe("texto string");
    });

    it("retorna response.output quando presente", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => ({
                    response: { output: "texto output" },
                }),
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBe("texto output");
    });

    it("retorna response.outputs[0].content quando presente", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => ({
                    response: {
                        outputs: [{ content: "texto array" }],
                    },
                }),
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBe("texto array");
    });

    it("retorna null quando outputs[0].content é string vazia", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => ({
                    response: {
                        outputs: [{ content: "" }],
                    },
                }),
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBeNull();
    });

    it("retorna null quando generateContent retorna null", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => null,
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBeNull();
    });

    it("usa o próprio result como fallback quando response não existe", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => ({
                    text: "texto direto no result",
                }),
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBe("texto direto no result");
    });

    it("retorna null e loga erro quando gerarDescricao lança exceção", async () => {
        aiService.__setGenAI({
            getGenerativeModel: () => ({
                generateContent: async () => {
                    throw new Error("Falha IA");
                },
            }),
        });

        const result = await aiService.gerarDescricao("Produto", "Categoria");
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
    });

    it("loga erro ao falhar inicialização do GoogleGenerativeAI", () => {
        process.env.GEMINI_API_KEY = "qualquer";
        jest.resetModules();

        jest.doMock("@google/generative-ai", () => ({
            GoogleGenerativeAI: jest.fn(() => {
                throw new Error("Erro fake");
            }),
        }));

        require("../../src/services/ai.service");

        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining("Falha ao inicializar GoogleGenerativeAI:"),
            expect.any(Error)
        );

        jest.dontMock("@google/generative-ai");
    });

    it("loga warning se GEMINI_API_KEY não informada", () => {
        process.env.GEMINI_API_KEY = "";
        jest.resetModules();

        require("../../src/services/ai.service");

        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining("GEMINI_API_KEY não informada")
        );
    });

    it("retorna null quando todas as tentativas do retry falham", async () => {
        jest.spyOn(aiService, "gerarDescricao")
            .mockRejectedValueOnce(new Error("Falha IA"));

        const result = await aiService.gerarDescricaoComRetry(
            "Produto",
            "Categoria",
            2,
            10
        );

        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalled();
    });

    it("retorna resultado quando uma tentativa intermediária do retry tem sucesso", async () => {
        const spy = jest
            .spyOn(aiService, "gerarDescricao")
            .mockRejectedValueOnce(new Error("Falha 1"))
            .mockResolvedValueOnce("Descrição válida");

        const result = await aiService.gerarDescricaoComRetry(
            "Produto",
            "Categoria",
            3,
            5000
        );

        expect(result).toBe("Descrição válida");
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
