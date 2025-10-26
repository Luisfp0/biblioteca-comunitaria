#!/bin/bash

# Script de setup automático da Biblioteca Comunitária
# Este script configura o Supabase e cria o banco de dados

set -e

echo "🚀 Iniciando setup da Biblioteca Comunitária..."
echo ""

# Verificar se o Supabase CLI está instalado
if ! command -v npx &> /dev/null; then
    echo "❌ npx não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se já existe .env.local
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado"
else
    echo "ℹ️  Arquivo .env.local já existe"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 OPÇÕES DE SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1) Desenvolvimento Local (Docker) - RECOMENDADO PARA TESTAR"
echo "   → Cria um banco Supabase local no seu computador"
echo "   → Não precisa de conta no Supabase"
echo "   → Funciona offline"
echo ""
echo "2) Produção (Supabase Cloud)"
echo "   → Usa o Supabase na nuvem"
echo "   → Precisa criar conta em supabase.com"
echo "   → Você fornece as credenciais"
echo ""
read -p "Escolha uma opção (1 ou 2): " opcao

if [ "$opcao" = "1" ]; then
    echo ""
    echo "🐳 Iniciando Supabase local..."
    echo "⚠️  IMPORTANTE: Você precisa ter Docker instalado e rodando!"
    echo ""
    read -p "Docker está instalado e rodando? (s/N): " docker_ok

    if [ "$docker_ok" != "s" ] && [ "$docker_ok" != "S" ]; then
        echo ""
        echo "📦 Instale o Docker primeiro:"
        echo "   https://docs.docker.com/get-docker/"
        exit 1
    fi

    echo ""
    echo "🚀 Iniciando Supabase local (isso pode demorar um pouco na primeira vez)..."
    npx supabase start

    echo ""
    echo "✅ Supabase local iniciado com sucesso!"
    echo ""
    echo "📝 Atualizando .env.local com as credenciais locais..."

    # Obter credenciais do Supabase local
    API_URL=$(npx supabase status | grep "API URL" | awk '{print $3}')
    ANON_KEY=$(npx supabase status | grep "anon key" | awk '{print $3}')

    # Atualizar .env.local
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$API_URL|" .env.local
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY|" .env.local
    rm .env.local.bak 2>/dev/null || true

    echo "✅ Arquivo .env.local atualizado!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✨ SETUP CONCLUÍDO COM SUCESSO!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Pronto! Agora você pode:"
    echo ""
    echo "   1. Executar: npm run dev"
    echo "   2. Abrir: http://localhost:3000"
    echo ""
    echo "📊 Para ver o Supabase Studio (admin do banco):"
    echo "   → http://localhost:54323"
    echo ""
    echo "🛑 Para parar o Supabase local:"
    echo "   → npm run supabase:stop"
    echo ""

elif [ "$opcao" = "2" ]; then
    echo ""
    echo "☁️  Configurando Supabase Cloud..."
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 PASSO A PASSO"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Acesse: https://supabase.com"
    echo "2. Crie uma conta ou faça login"
    echo "3. Clique em 'New Project'"
    echo "4. Preencha os dados e aguarde a criação"
    echo "5. Vá em 'Project Settings' → 'API'"
    echo ""

    read -p "Pressione ENTER quando tiver criado o projeto..."

    echo ""
    read -p "Cole a Project URL: " project_url
    read -p "Cole a anon key: " anon_key

    # Atualizar .env.local
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$project_url|" .env.local
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key|" .env.local
    rm .env.local.bak 2>/dev/null || true

    echo ""
    echo "✅ Credenciais salvas em .env.local"
    echo ""
    echo "🗄️  Agora vamos criar as tabelas no banco de dados..."
    echo ""
    read -p "Deseja aplicar as migrations automaticamente? (s/N): " apply_migrations

    if [ "$apply_migrations" = "s" ] || [ "$apply_migrations" = "S" ]; then
        echo ""
        echo "📋 Para aplicar as migrations, você precisa linkar o projeto:"
        echo ""
        read -p "Cole o Project ID (encontre em Project Settings): " project_id

        npx supabase link --project-ref "$project_id"

        echo ""
        echo "🚀 Aplicando migrations..."
        npx supabase db push

        echo ""
        echo "✅ Migrations aplicadas!"
    else
        echo ""
        echo "📋 Aplique as migrations manualmente:"
        echo ""
        echo "1. No Supabase, vá em 'SQL Editor'"
        echo "2. Abra o arquivo: supabase-schema.sql"
        echo "3. Copie todo o conteúdo"
        echo "4. Cole no SQL Editor e clique em 'Run'"
    fi

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✨ SETUP CONCLUÍDO COM SUCESSO!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Pronto! Agora você pode:"
    echo ""
    echo "   1. Executar: npm run dev"
    echo "   2. Abrir: http://localhost:3000"
    echo ""

else
    echo "❌ Opção inválida!"
    exit 1
fi
