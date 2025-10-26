-- Adicionar campo de tags na tabela livros (array de texto)
ALTER TABLE livros ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Criar índice para busca eficiente por tags
CREATE INDEX IF NOT EXISTS idx_livros_tags ON livros USING GIN(tags);

-- Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  livro_id UUID REFERENCES livros(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(livro_id, ip_address)
);

-- Criar índice para contagem de favoritos por livro
CREATE INDEX IF NOT EXISTS idx_favoritos_livro_id ON favoritos(livro_id);

-- Habilitar RLS na tabela favoritos
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de favoritos
CREATE POLICY "Permitir leitura pública de favoritos"
  ON favoritos
  FOR SELECT
  TO public
  USING (true);

-- Política para permitir inserção pública de favoritos
CREATE POLICY "Permitir inserção pública de favoritos"
  ON favoritos
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para permitir exclusão pública de favoritos (desfavoritar)
CREATE POLICY "Permitir exclusão pública de favoritos"
  ON favoritos
  FOR DELETE
  TO public
  USING (true);

-- Criar view para contar favoritos por livro
CREATE OR REPLACE VIEW livros_com_favoritos AS
SELECT
  l.*,
  COALESCE(COUNT(f.id), 0)::INTEGER as total_favoritos
FROM livros l
LEFT JOIN favoritos f ON l.id = f.livro_id
GROUP BY l.id;
