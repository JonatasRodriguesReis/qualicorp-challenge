CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS coverages (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS plan_coverages (
  plan_id UUID REFERENCES plans(id),
  coverage_id UUID REFERENCES coverages(id),
  PRIMARY KEY (plan_id, coverage_id)
);

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY,
  plan_id UUID REFERENCES plans(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS proposal_members (
  id UUID PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  is_holder BOOLEAN NOT NULL
);

-- Dados Iniciais para Teste
INSERT INTO plans (id, name, base_price) VALUES ('550e8400-e29b-41d4-a716-446655440001', 'QualiGold', 500.00);
INSERT INTO coverages (id, name, description) VALUES ('550e8400-e29b-41d4-a716-446655440002', 'Dental', 'Basic dental care');
INSERT INTO plan_coverages (plan_id, coverage_id) VALUES ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');