-- ============================================================
-- Migration: Fix Missing Policies, Triggers & Schema Gaps
-- BeasiswaPlus — 2026-10-02
-- ============================================================

-- ============================================================
-- 1. HELPER FUNCTION: auto set updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 2. FIX: profiles
--    - Tambah INSERT policy (user tidak bisa buat profil sendiri)
--    - Tambah kolom updated_at trigger
-- ============================================================

-- Policy INSERT profiles (belum ada)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Trigger updated_at untuk profiles
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3. FIX: scholarships
--    - Default id salah (auth.uid()), perbaiki ke gen_random_uuid()
--    - Tambah kolom updated_at
-- ============================================================

ALTER TABLE public.scholarships
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.scholarships
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now());

CREATE TRIGGER set_scholarships_updated_at
BEFORE UPDATE ON public.scholarships
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 4. BARU: scholarship_requirements
--    Tabel syarat matching engine yang BELUM ADA
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scholarship_requirements (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id  UUID        NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  requirement_type TEXT       NOT NULL,
  -- Contoh requirement_type: 'gpa', 'monthly_household_income',
  --   'first_generation', 'semester', 'orphan_status', 'document'
  operator        VARCHAR(10) NOT NULL,
  -- Contoh operator: '>=', '<=', '=', '>', '<', 'in'
  value           TEXT        NOT NULL,
  -- Nilai pembanding selalu disimpan sebagai text, parse di aplikasi
  is_required     BOOLEAN     NOT NULL DEFAULT true,
  -- true = hard filter (gagal = tidak eligible)
  -- false = soft preference (mempengaruhi score)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_requirements_scholarship_id
  ON public.scholarship_requirements(scholarship_id);

ALTER TABLE public.scholarship_requirements ENABLE ROW LEVEL SECURITY;

-- Semua user terautentikasi bisa baca requirements (untuk matching)
CREATE POLICY "Authenticated users can view requirements"
ON public.scholarship_requirements FOR SELECT
TO authenticated
USING (true);


-- ============================================================
-- 5. FIX: scholarship_applications
--    - Tambah enum values: interested, preparing, ready
--    - Tambah UPDATE policy (user bisa update status aplikasi sendiri)
--    - Tambah kolom updated_at + trigger
--    - Tambah kolom submitted_at
-- ============================================================

-- Tambah nilai enum baru untuk application_status_enum
ALTER TYPE public.application_status_enum
  ADD VALUE IF NOT EXISTS 'interested' BEFORE 'submitted';
ALTER TYPE public.application_status_enum
  ADD VALUE IF NOT EXISTS 'preparing'  BEFORE 'submitted';
ALTER TYPE public.application_status_enum
  ADD VALUE IF NOT EXISTS 'ready'      BEFORE 'submitted';

-- Ubah default status ke 'interested' sesuai panduan alur
ALTER TABLE public.scholarship_applications
  ALTER COLUMN status SET DEFAULT 'interested'::public.application_status_enum;

-- Tambah kolom submitted_at dan updated_at
ALTER TABLE public.scholarship_applications
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now());

-- Policy UPDATE (user bisa ubah status aplikasi sendiri)
CREATE POLICY "Users can update their own applications"
ON public.scholarship_applications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy DELETE (user bisa batalkan / hapus aplikasi sendiri)
CREATE POLICY "Users can delete their own applications"
ON public.scholarship_applications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON public.scholarship_applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 6. FIX: document_vault
--    - Tambah trigger updated_at
--    - Tambah kolom storage_path (path di Supabase Storage)
-- ============================================================
ALTER TABLE public.document_vault
  ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Isi storage_path dari file_url untuk data yang sudah ada (jika ada)
-- UPDATE public.document_vault SET storage_path = file_url WHERE storage_path IS NULL;

CREATE TRIGGER set_document_vault_updated_at
BEFORE UPDATE ON public.document_vault
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 7. FIX: emergency_grants
--    - Tambah trigger updated_at
-- ============================================================
CREATE TRIGGER set_emergency_grants_updated_at
BEFORE UPDATE ON public.emergency_grants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 8. FIX: chat_messages
--    - Tambah policy INSERT (sebelumnya hanya ALL USING yang berlaku
--      untuk SELECT/UPDATE/DELETE, bukan INSERT)
-- ============================================================
DROP POLICY IF EXISTS "Users can manage their chat messages" ON public.chat_messages;

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


-- ============================================================
-- 9. TRIGGER: Auto-create profile saat user baru register
--    Sangat penting agar profil terbentuk otomatis setelah signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 10. SEED: Contoh data beasiswa untuk development
-- ============================================================
INSERT INTO public.scholarships (
  title, slug, provider_name, description, benefits,
  funding_type, min_gpa, max_household_income,
  target_first_gen_priority, target_orphan_priority,
  required_docs, deadline, is_active
) VALUES
(
  'Beasiswa Bidikmisi KIP-K',
  'bidikmisi-kip-k',
  'Kemdikbud RI',
  'Beasiswa pemerintah untuk mahasiswa dari keluarga kurang mampu yang berprestasi.',
  'Biaya kuliah full + biaya hidup Rp 700.000/bulan',
  'full', 3.00, 4000000,
  true, false,
  ARRAY['KTM', 'KK', 'SKTM', 'Transkrip', 'Rekening Listrik'],
  '2027-03-31T23:59:59Z', true
),
(
  'Beasiswa Yayasan Pendidikan Nusantara',
  'ypn-2026',
  'Yayasan Pendidikan Nusantara',
  'Beasiswa untuk mahasiswa yatim/piatu berprestasi di seluruh Indonesia.',
  'Biaya kuliah s.d. Rp 12.000.000/semester',
  'partial', 2.75, 6000000,
  false, true,
  ARRAY['KTM', 'Akte Kematian Orang Tua', 'Transkrip', 'SKTM'],
  '2027-01-31T23:59:59Z', true
),
(
  'Beasiswa First Generation Scholarship',
  'first-gen-2026',
  'BeasiswaPlus Foundation',
  'Khusus untuk generasi pertama dalam keluarga yang berhasil mengenyam pendidikan tinggi.',
  'Biaya kuliah Rp 8.000.000/semester + mentoring',
  'partial', 3.20, 5000000,
  true, false,
  ARRAY['KTM', 'KK', 'SKTM', 'Surat Pernyataan First Generation'],
  '2026-12-31T23:59:59Z', true
)
ON CONFLICT (slug) DO NOTHING;


-- Tambahkan requirements untuk setiap beasiswa
-- Bidikmisi
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
SELECT id, 'gpa',                      '>=', '3.00',    true  FROM public.scholarships WHERE slug = 'bidikmisi-kip-k'
UNION ALL
SELECT id, 'monthly_household_income', '<=', '4000000', true  FROM public.scholarships WHERE slug = 'bidikmisi-kip-k'
UNION ALL
SELECT id, 'semester',                 '>=', '1',       true  FROM public.scholarships WHERE slug = 'bidikmisi-kip-k'
UNION ALL
SELECT id, 'document',                 '=',  'SKTM',    true  FROM public.scholarships WHERE slug = 'bidikmisi-kip-k'
ON CONFLICT DO NOTHING;

-- YPN (Yayasan Pendidikan Nusantara)
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
SELECT id, 'gpa',          '>=', '2.75',        true  FROM public.scholarships WHERE slug = 'ypn-2026'
UNION ALL
SELECT id, 'orphan_status','!=', 'none',         true  FROM public.scholarships WHERE slug = 'ypn-2026'
UNION ALL
SELECT id, 'monthly_household_income', '<=', '6000000', false FROM public.scholarships WHERE slug = 'ypn-2026'
ON CONFLICT DO NOTHING;

-- First Generation
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
SELECT id, 'gpa',                      '>=', '3.20',    true  FROM public.scholarships WHERE slug = 'first-gen-2026'
UNION ALL
SELECT id, 'is_first_generation',      '=',  'true',    true  FROM public.scholarships WHERE slug = 'first-gen-2026'
UNION ALL
SELECT id, 'monthly_household_income', '<=', '5000000', true  FROM public.scholarships WHERE slug = 'first-gen-2026'
ON CONFLICT DO NOTHING;
