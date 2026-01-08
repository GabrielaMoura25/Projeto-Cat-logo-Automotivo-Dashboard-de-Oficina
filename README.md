# 🚗 Sistema Automotivo com IA - Catálogo + Dashboard

> Solução completa para gestão de catálogo de peças automotivas e análise gerencial de oficinas, utilizando Inteligência Artificial para enriquecer dados e gerar insights acionáveis.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Powered-yellow.svg)](https://ai.google.dev/)

---

## 📋 Visão Geral

Este projeto consiste em **dois sistemas integrados** que demonstram o uso prático de **Inteligência Artificial** em contextos automotivos reais:

### 🔧 1. API de Catálogo Automotivo (Backend)
API REST que utiliza IA para **melhorar a qualidade dos dados** de um catálogo de peças automotivas.

**Problema resolvido:** Catálogos mal estruturados com produtos duplicados, categorias inconsistentes e descrições fracas.

**Solução:** IA gera descrições técnicas automaticamente, normaliza categorias e enriquece informações.

📁 [**Documentação Completa →** catalogo-automotivo-api/README.md](./catalogo-automotivo-api/README.md)

---

### 📊 2. Dashboard de Gestão de Oficina (Frontend)
Dashboard web que utiliza IA para **interpretar dados operacionais** e gerar insights gerenciais.

**Problema resolvido:** Gráficos isolados que não geram decisão, falta de análise crítica dos dados.

**Solução:** IA atua como analista de negócios, identificando problemas e oportunidades automaticamente.

📁 [**Documentação Completa →** dashboard-oficina/README.md](./dashboard-oficina/README.md)

---

## 🎯 Principais Diferenciais

| Característica | Descrição |
|----------------|-----------|
| **🤖 IA como Ferramenta de Negócio** | Não é um recurso opcional, é parte ativa da solução |
| **📦 Solução Completa** | Backend + Frontend funcionando juntos |
| **🐳 Docker Ready** | Suba toda a stack em 2 comandos |
| **✅ 100% Testado** | Testes automatizados em ambos os projetos |
| **🔒 Produção-Ready** | Tratamento de erros, logs, validações |

---

## 🚀 Quick Start

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/GabrielaMoura25/Projeto-Catalogo-Automotivo-Dashboard-de-Oficina.git
cd Projeto-Catalogo-Automotivo-Dashboard-de-Oficina

# Suba toda a stack
cd catalogo-automotivo-api
docker-compose up -d

# API estará em: http://localhost:3000
```

### Opção 2: Local

#### Backend (API)
```bash
cd catalogo-automotivo-api
npm install
npm run dev
# http://localhost:3000
```

#### Frontend (Dashboard)
```bash
cd dashboard-oficina
npm install
npm run dev
# http://localhost:5173
```

---

## 🏗 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO FINAL                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Dashboard (React)    │
         │  Port: 5173           │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  API REST (Node.js)   │
         │  Port: 3000           │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  MySQL 8.0   │          │ Google Gemini│
│  Port: 3306  │          │  (IA Cloud)  │
└──────────────┘          └──────────────┘
```

---

## 📸 Demonstração

### Backend - API de Catálogo

![Criação de Produto](catalogo-automotivo-api/screenshots/api-create.png)

**Exemplo:** Ao criar um produto com apenas nome e categoria, a IA gera automaticamente uma descrição técnica completa.

---

### Frontend - Dashboard de Gestão

![Dashboard Completo](dashboard-oficina/screenshots/dashboard-completo.png)

**Exemplo:** IA analisa ordens de serviço e gera insights gerenciais como "Há ordens abertas há muito tempo, isso retém capital".

---

## 🤖 Como a IA é Utilizada

### No Backend (Catálogo)

```javascript
// Fluxo: Criar Produto
POST /api/products
{
  "nome": "Amortecedor Traseiro",
  "categoria": "Suspensão",
  "marca": "Monroe",
  "aplicacao_veicular": "HB20 1.6 2015+"
}

// IA processa e enriquece
↓

{
  "id": 219,
  "nome": "Amortecedor Traseiro",
  "categoria": "Suspensão",
  "marca": "Monroe",
  "aplicacao_veicular": "HB20 1.6 2015+",
  "descricao": "Amortecedor traseiro projetado para o sistema de 
                suspensão automotiva. Atua no controle de oscilação 
                das molas, garantindo o contato contínuo dos pneus 
                com o solo e a estabilidade do veículo..."
}
```

**Quando a IA é chamada:**
- ✅ Ao criar produto (gera descrição)
- ✅ Ao buscar produtos (enriquece resultados)
- ❌ Ao listar todos (evita custo desnecessário)

---

### No Frontend (Dashboard)

```javascript
// Fluxo: Exibir Dashboard
Dados de ordens → IA analisa → Gera insights

// Exemplo de insight gerado:
"⚠️ Pontos de Atenção:
- Monitore o tempo médio de conclusão das ordens abertas
- Acompanhe disponibilidade de estoque de peças
- Avalie capacidade da equipe em períodos de alta demanda"
```

**Quando a IA é chamada:**
- ✅ Ao carregar dados (automático)
- ✅ Quando dados mudam
- ❌ Em chamadas duplicadas (cache inteligente)

---

## 📚 Tecnologias Utilizadas

### Backend
- **Node.js 20+** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL 8.0** - Banco de dados
- **Google Gemini AI** - Geração de descrições
- **Docker** - Containerização

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **Google Gemini AI** - Análise de dados
- **Vitest** - Testes (100% coverage)

---

## 🧪 Testes

Ambos os projetos possuem **100% de cobertura de testes**.

```bash
# Backend
cd catalogo-automotivo-api
npm test
npm run test:coverage

# Frontend
cd dashboard-oficina
npm test
npm run test:coverage
```

---

## 📂 Estrutura do Repositório

```
Projeto-Catalogo-Automotivo-Dashboard-de-Oficina/
│
├── catalogo-automotivo-api/          # 🔧 Backend
│   ├── src/
│   │   ├── controllers/              # Lógica de requisições
│   │   ├── routes/                   # Endpoints da API
│   │   ├── services/                 # Integração com IA
│   │   ├── db/                       # Conexão MySQL
│   │   └── server.js                 # Entry point
│   ├── tests/                        # Testes automatizados
│   ├── docker-compose.yml            # Stack completa
│   └── README.md                     # 📖 Documentação detalhada
│
├── dashboard-oficina/                # 📊 Frontend
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── services/                 # Integração com IA
│   │   └── utils/                    # Helpers
│   ├── tests/                        # Testes (100% coverage)
│   └── README.md                     # 📖 Documentação detalhada
│
└── README.md                         # 📖 Você está aqui!
```

---

## 🔐 Configuração de Segredos

Ambos os projetos precisam de uma **API Key do Google Gemini**:

1. Acesse: https://ai.google.dev/
2. Crie um projeto e gere uma API Key
3. Configure nos `.env` de cada projeto:

```env
# catalogo-automotivo-api/.env
GEMINI_API_KEY=sua_chave_aqui
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=catalogo_automotivo

# dashboard-oficina/.env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

> **💡 Nota:** Ambos funcionam sem API Key em modo demo/fallback.

---

## 🎓 Aprendizados e Decisões Técnicas

### 1. IA como Ferramenta de Negócio
A IA não é um "extra", ela resolve problemas reais:
- **Backend:** Reduz inconsistências de cadastro
- **Frontend:** Gera insights que humanos levariam horas

### 2. Arquitetura Desacoplada
Backend e Frontend podem evoluir independentemente.

### 3. Resiliência
Sistema **nunca quebra** por falha da IA (fallbacks inteligentes).

### 4. Testabilidade
100% de cobertura garante segurança para refatorações.

---

## 🔮 Roadmap de Melhorias

- [ ] **Autenticação JWT** em ambos os sistemas
- [ ] **Cache Redis** para reduzir custo de IA
- [ ] **Monitoramento** (Sentry, Prometheus)
- [ ] **CI/CD** automatizado
- [ ] **Integração real** entre Backend e Frontend
- [ ] **Multi-tenancy** no backend
- [ ] **PWA** no frontend

---

## 👨‍💻 Autor

**Gabriela Moura**

Desenvolvedora Full Stack especializada em soluções com IA

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Gabriela%20Moura-0077B5?logo=linkedin)](https://linkedin.com/in/seu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-GabrielaMoura25-181717?logo=github)](https://github.com/GabrielaMoura25)
[![Portfolio](https://img.shields.io/badge/Portfolio-gabrielamoura.dev-FF6B6B)](https://gabrielamoura.dev)

---

## 📄 Licença

Este projeto foi desenvolvido como parte de testes técnicos para demonstração de habilidades em:

- ✅ Node.js e React.js
- ✅ Integração com APIs de IA
- ✅ Arquitetura de software
- ✅ Docker e DevOps
- ✅ Testes automatizados

Código disponível para fins educacionais e de portfólio.

---

<div align="center">

**Desenvolvido com ❤️ e ☕ por Gabriela Moura**

[⬆ Voltar ao topo](#-sistema-automotivo-com-ia---catálogo--dashboard)

</div>