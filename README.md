# Biblioteca Comunitária

Um site para gerenciar uma biblioteca comunitária de livros livres, onde as pessoas podem pegar livros e doar outros.

## Funcionalidades

- 📚 Visualizar todos os livros disponíveis
- 🔍 Buscar por título ou autor
- 🏷️ Filtrar por gênero e disponibilidade
- 👨‍💼 Painel admin para gerenciar livros
- 📱 Responsivo (mobile-first)

## Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e storage

## Setup Rápido (RECOMENDADO)

### Opção 1: Setup Automático Local (Mais Fácil!)

Perfeito para testar e desenvolver sem precisar criar conta no Supabase:

```bash
# 1. Instalar dependências
npm install

# 2. Executar setup automático
npm run setup
```

Escolha a opção **1 (Desenvolvimento Local)** e siga as instruções.

**Requisitos:**

- Docker instalado e rodando ([instalar Docker](https://docs.docker.com/get-docker/))

**O que o script faz:**

- ✅ Inicia um banco Supabase local no Docker
- ✅ Cria automaticamente todas as tabelas
- ✅ Configura o arquivo `.env.local`
- ✅ Tudo pronto para rodar!

Depois é só executar:

```bash
npm run dev
```

### Opção 2: Setup Automático Cloud

Se você já tem ou quer criar uma conta no Supabase Cloud:

```bash
# 1. Instalar dependências
npm install

# 2. Executar setup automático
npm run setup
```

Escolha a opção **2 (Produção)** e siga as instruções.

O script vai te guiar para:

- Criar o projeto no Supabase
- Configurar as credenciais
- Aplicar as migrations

## Configuração Manual (Alternativa)

Se preferir fazer manualmente:

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em `Project Settings` > `API` e copie:
   - `Project URL`
   - `anon public` key

### 2. Configurar banco de dados

1. No painel do Supabase, vá em `SQL Editor`
2. Copie todo o conteúdo do arquivo `supabase-schema.sql`
3. Cole no editor SQL e execute

Isso vai criar:

- Tabela `livros`
- Políticas de segurança (RLS)
- Storage bucket para fotos das capas

### 3. Configurar variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e adicione suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   ADMIN_PASSWORD=sua-senha-admin
   ```

### 4. Instalar dependências e rodar

```bash
npm install
npm run dev
```

O site estará disponível em [http://localhost:3000](http://localhost:3000)

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev                 # Inicia o servidor de desenvolvimento

# Setup e Configuração
npm run setup              # Script de setup automático (recomendado)

# Supabase Local (Docker)
npm run supabase:start     # Inicia Supabase local
npm run supabase:stop      # Para Supabase local
npm run supabase:status    # Ver status e credenciais
npm run supabase:reset     # Resetar banco de dados local

# Build
npm run build              # Build para produção
npm run start              # Roda versão de produção
```

## Como usar

### Usuário comum

1. Acesse a página principal para ver os livros disponíveis
2. Use os filtros para buscar livros por título, autor, gênero ou status
3. Veja a página "Sobre" para entender como funciona a biblioteca

### Admin

1. Acesse `/admin`
2. Entre com a senha configurada no `.env.local` (padrão: `admin123`)
3. Adicione novos livros preenchendo o formulário
4. Gerencie os livros existentes:
   - Altere o status de "Disponível" para "Retirado" no final do dia
   - Delete livros que não estão mais na estante

## Dicas

### Fotos das capas

Você pode usar URLs de capas de livros de sites como:

- Google Books
- Amazon
- Open Library

Exemplo de busca no Google: `"nome do livro" capa png`

### Upload de fotos

Se quiser fazer upload direto no Supabase:

1. Acesse o Supabase Studio:
   - Local: http://localhost:54323
   - Cloud: seu-projeto.supabase.co
2. Vá em `Storage` > `capas-livros`
3. Faça upload da imagem
4. Copie a URL pública e cole no formulário

### QR Code para a estante

Para facilitar o acesso:

1. Gere um QR code do seu site (use qr-code-generator.com)
2. Imprima e cole na estante
3. As pessoas escaneiam e veem os livros disponíveis

## Deploy

### Vercel (Recomendado)

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. Deploy automático!

### Outras opções

- Netlify
- Railway
- Render

## Estrutura do projeto

```
biblioteca-comunitaria/
├── app/
│   ├── admin/              # Painel admin
│   ├── sobre/              # Página sobre
│   └── page.tsx            # Página principal
├── components/
│   ├── Header.tsx          # Cabeçalho
│   ├── LivroCard.tsx       # Card de livro
│   ├── Filtros.tsx         # Filtros de busca
│   └── SetupInstrucoes.tsx # Tela de setup
├── lib/
│   └── supabase.ts         # Configuração do Supabase
├── scripts/
│   └── setup.sh            # Script de setup automático
├── supabase/
│   ├── config.toml         # Configuração do Supabase
│   └── migrations/         # Migrations do banco
├── supabase-schema.sql     # Schema do banco (para uso manual)
└── .env.local              # Variáveis de ambiente (criar este)
```

## Troubleshooting

### Erro: "supabaseUrl is required"

Execute o setup: `npm run setup` ou configure o `.env.local` manualmente

### Docker não está rodando

- **Linux**: `sudo systemctl start docker`
- **Mac/Windows**: Abra o Docker Desktop

### Porta já em uso

Se a porta 3000 estiver ocupada, use: `npm run dev -- -p 3001`

### Resetar banco de dados local

```bash
npm run supabase:reset
```

## Licença

MIT
