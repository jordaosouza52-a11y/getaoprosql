# Backend GestãoPro com SQLite (SQL)

Backend da aplicação GestãoPro desenvolvido em Node.js/Express com banco de dados SQLite.

## Requisitos

- Node.js 14+
- npm ou yarn

## Instalação

1. Navegue até a pasta do backend:
```bash
cd backend
```
2. Instale as dependências:
```bash
npm install
```

## Executar o servidor

```bash
npm start
```

O servidor estará disponível em `http://localhost:5000`

## Estrutura do Projeto

```
backend/
├── server.js              # Arquivo principal do servidor
├── package.json           # Dependências do projeto
├── .env                   # Variáveis de ambiente
├── database.sqlite.sql    # Script SQL para criar o banco SQLite
├── gestaopro.db           # Arquivo do banco de dados SQLite (criado na primeira execução)
├── routes/                # Rotas da API
│   └── ...                # Rotas para todas as entidades
└── uploads/               # Diretório para uploads de arquivos (simulado)
```

**Nota:** Este backend utiliza SQLite, um banco de dados SQL baseado em arquivo, que não requer um servidor de banco de dados separado, tornando a implantação mais simples.

