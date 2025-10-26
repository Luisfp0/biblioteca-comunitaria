# 🚀 Início Rápido - Biblioteca Comunitária

## Para começar AGORA (3 passos)

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar o setup
```bash
npm run setup
```

**Escolha uma opção:**
- **Opção 1**: Desenvolvimento Local (precisa do Docker)
  - Mais fácil para testar
  - Tudo automático
  - Não precisa criar conta

- **Opção 2**: Supabase Cloud
  - Para produção
  - Precisa criar conta grátis em supabase.com
  - O script te guia

### 3. Iniciar o projeto
```bash
npm run dev
```

Pronto! Acesse: **http://localhost:3000**

---

## Usando desenvolvimento local? (Opção 1)

Se você escolheu a opção 1 (Docker), você também tem acesso ao **Supabase Studio**:

**http://localhost:54323**

Lá você pode:
- Ver as tabelas do banco
- Fazer upload de imagens
- Executar queries SQL
- Ver logs

---

## Primeiros passos no site

1. **Página inicial**: Veja a lista de livros (vazia no início)
2. **Admin** (botão no topo):
   - Senha padrão: `admin123`
   - Adicione seu primeiro livro!
3. **Sobre**: Explica como funciona

---

## Próximos passos

- Adicione livros através do painel admin
- Personalize a senha admin no `.env.local`
- Faça deploy na Vercel quando estiver pronto

---

## Comandos úteis

```bash
npm run dev                # Rodar o site
npm run supabase:status    # Ver credenciais do banco local
npm run supabase:stop      # Parar o banco local
npm run supabase:reset     # Resetar o banco (limpa tudo)
```

---

## Problemas?

Veja o arquivo **README.md** para mais detalhes ou troubleshooting.
