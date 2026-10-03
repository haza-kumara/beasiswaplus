-- ============================================================
-- Migration: Create Core Tables
-- BeasiswaPlus — 2026-10-02
-- Harus dijalankan PERTAMA sebelum migration lainnya
-- ============================================================


-- ============================================================
-- 1. ENUM: status aplikasi beasiswa
-- ============================================================
CREATE TYPE public.application_status_enum AS ENUM (
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'cancelled'
);


-- ============================================================
-- 2. TABEL: profiles
--    Satu baris per user, id = auth.users.id
-- ============================================================
CREATE TABLE public.profiles (
  id                      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT,
  university              TEXT,
  study_program           TEXT,
  semester                INTEGER,
  gpa                     NUMERIC(3, 2),
  monthly_household_income NUMERIC,
  household_size          INTEGER,
  first_generation        BOOLEAN     NOT NULL DEFAULT false,
  orphan_status           BOOLEAN     NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- ============================================================
-- 3. TABEL: scholarships
--    Data beasiswa — diisi admin / seed
-- ============================================================
CREATE TABLE public.scholarships (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  provider        TEXT        NOT NULL,
  description     TEXT,
  application_url TEXT,
  min_gpa         NUMERIC(3, 2),
  max_income      NUMERIC,
  deadline        TIMESTAMPTZ,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Semua user terautentikasi bisa baca beasiswa
CREATE POLICY "Authenticated users can view scholarships"
ON public.scholarships FOR SELECT
TO authenticated
USING (true);


-- ============================================================
-- 4. TABEL: scholarship_requirements
--    Syarat per beasiswa untuk matching engine
-- ============================================================
CREATE TABLE public.scholarship_requirements (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id   UUID        NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  requirement_type TEXT        NOT NULL,
  -- Contoh: 'gpa', 'monthly_household_income', 'first_generation',
  --         'semester', 'orphan_status', 'study_program', 'document'
  operator         VARCHAR(10) NOT NULL,
  -- Contoh: '>=', '<=', '=', '>', '<', '!=', 'in'
  value            TEXT        NOT NULL,
  -- Selalu disimpan sebagai text, parse di aplikasi
  is_required      BOOLEAN     NOT NULL DEFAULT true,
  -- true = hard filter, false = soft preference (mempengaruhi score)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_requirements_scholarship_id
  ON public.scholarship_requirements(scholarship_id);

ALTER TABLE public.scholarship_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view requirements"
ON public.scholarship_requirements FOR SELECT
TO authenticated
USING (true);


-- ============================================================
-- 5. TABEL: scholarship_applications
--    Tracking aplikasi user ke beasiswa
-- ============================================================
CREATE TABLE public.scholarship_applications (
  id             UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID                         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID                         NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  status         public.application_status_enum NOT NULL DEFAULT 'submitted',
  notes          TEXT,
  submitted_at   TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (user_id, scholarship_id)
);

CREATE INDEX idx_applications_user_id
  ON public.scholarship_applications(user_id);

ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
ON public.scholarship_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
ON public.scholarship_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 6. TABEL: document_vault
--    Dokumen yang diupload user (KTM, SKTM, dll)
-- ============================================================
CREATE TABLE public.document_vault (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT       NOT NULL,
  -- Contoh: 'KTM', 'SKTM', 'Transkrip', 'KK'
  file_url     TEXT,
  storage_path TEXT,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_documents_user_id
  ON public.document_vault(user_id);

ALTER TABLE public.document_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
ON public.document_vault FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
ON public.document_vault FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.document_vault FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- ============================================================
-- 7. TABEL: emergency_grants
--    Dana darurat / bantuan mendesak
-- ============================================================
CREATE TABLE public.emergency_grants (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason      TEXT        NOT NULL,
  amount      NUMERIC,
  status      TEXT        NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.emergency_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own grants"
ON public.emergency_grants FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grants"
ON public.emergency_grants FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 8. TABEL: chat_messages
--    Riwayat chat / AI assistant
-- ============================================================
CREATE TABLE public.chat_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_chat_user_id
  ON public.chat_messages(user_id);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their chat messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their chat messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their chat messages"
ON public.chat_messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
