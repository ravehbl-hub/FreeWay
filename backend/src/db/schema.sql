-- FreeWay database schema (PostgreSQL)
-- Safe to run many times: uses IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  category      VARCHAR(20)   NOT NULL CHECK (category IN ('compact', 'suv', 'premium')),
  seats         INTEGER       NOT NULL CHECK (seats BETWEEN 1 AND 9),
  transmission  VARCHAR(10)   NOT NULL CHECK (transmission IN ('auto', 'manual')),
  fuel_type     VARCHAR(10)   NOT NULL DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
  price_per_day NUMERIC(10,2) NOT NULL CHECK (price_per_day > 0),
  image_url     TEXT,
  available     BOOLEAN       NOT NULL DEFAULT TRUE,
  co2_per_km    NUMERIC(6,3)  NOT NULL DEFAULT 0.120, -- kg CO2 per km
  description   TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id      INTEGER       NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date      DATE          NOT NULL,
  end_date        DATE          NOT NULL,
  pickup_time     VARCHAR(5)    NOT NULL DEFAULT '10:00',
  pickup_location VARCHAR(120)  NOT NULL,
  status          VARCHAR(12)   NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  total_price     NUMERIC(10,2) NOT NULL,
  insurance       BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_bookings_user    ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON bookings(vehicle_id);

-- AI chat: one conversation has many messages
CREATE TABLE IF NOT EXISTS ai_conversations (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(120) NOT NULL DEFAULT 'New conversation',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER     NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);

-- AI "recommended for you" results (structured output saved per user)
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INTEGER     NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  reason     TEXT        NOT NULL,
  score      INTEGER     NOT NULL DEFAULT 0,
  summary    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendations(user_id);
