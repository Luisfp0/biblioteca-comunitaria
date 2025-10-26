-- Criar tabela de livros
CREATE TABLE IF NOT EXISTS livros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  descricao TEXT,
  ano INTEGER,
  genero TEXT,
  foto_capa_url TEXT,
  status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'retirado')),
  data_adicionado TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_livros_status ON livros(status);
CREATE INDEX IF NOT EXISTS idx_livros_genero ON livros(genero);
CREATE INDEX IF NOT EXISTS idx_livros_titulo ON livros(titulo);

-- Habilitar Row Level Security (RLS)
ALTER TABLE livros ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (qualquer pessoa pode ver os livros)
CREATE POLICY "Permitir leitura pública de livros"
  ON livros
  FOR SELECT
  TO public
  USING (true);

-- Política para permitir inserção pública (qualquer pessoa pode adicionar livros)
-- Você pode restringir isso depois se preferir
CREATE POLICY "Permitir inserção pública de livros"
  ON livros
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para permitir atualização pública (para atualizar status)
-- Você pode restringir isso depois se preferir
CREATE POLICY "Permitir atualização pública de livros"
  ON livros
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Política para permitir exclusão pública
-- Você pode restringir isso depois se preferir
CREATE POLICY "Permitir exclusão pública de livros"
  ON livros
  FOR DELETE
  TO public
  USING (true);

-- Criar storage bucket para fotos de capas
INSERT INTO storage.buckets (id, name, public)
VALUES ('capas-livros', 'capas-livros', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage para permitir upload público
CREATE POLICY "Permitir upload público de capas"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'capas-livros');

-- Política de storage para permitir leitura pública
CREATE POLICY "Permitir leitura pública de capas"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'capas-livros');

-- Política de storage para permitir exclusão pública
CREATE POLICY "Permitir exclusão pública de capas"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'capas-livros');
