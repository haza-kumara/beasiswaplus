-- ============================================================
-- Migration: Ubah PK scholarships & scholarship_requirements
--            dari UUID ke BIGSERIAL (auto-increment integer)
-- BeasiswaPlus — 2026-10-02
-- ============================================================

-- LANGKAH PELAKSANAAN:
-- 1. Hapus FK di scholarship_applications yang mengacu ke scholarships.id
-- 2. Hapus tabel scholarship_requirements (ada FK ke scholarships.id)
-- 3. Ubah tipe kolom scholarships.id → BIGINT + sequence
-- 4. Recreate scholarship_requirements dengan BIGSERIAL + FK BIGINT
-- 5. Recreate FK di scholarship_applications
-- 6. Seed ulang requirements (scholarships seed masih ada, ID-nya berurutan)


-- ============================================================
-- STEP 1: Drop FK pada scholarship_applications.scholarship_id
-- ============================================================
ALTER TABLE public.scholarship_applications
  DROP CONSTRAINT IF EXISTS scholarship_applications_scholarship_id_fkey;

-- Ubah tipe kolom scholarship_applications.scholarship_id ke BIGINT
ALTER TABLE public.scholarship_applications
  ALTER COLUMN scholarship_id TYPE BIGINT USING NULL;
-- NOTE: Data aplikasi yang sudah ada AKAN KEHILANGAN scholarship_id-nya
-- karena UUID tidak bisa dikonversi ke BIGINT. Di fase development ini aman.


-- ============================================================
-- STEP 2: Drop tabel scholarship_requirements (akan dibuat ulang)
-- ============================================================
DROP TABLE IF EXISTS public.scholarship_requirements;


-- ============================================================
-- STEP 3: Ubah scholarships.id dari UUID ke BIGSERIAL
-- ============================================================

-- 3a. Hapus default UUID lama
ALTER TABLE public.scholarships
  ALTER COLUMN id DROP DEFAULT;

-- 3b. Hapus data lama (ID UUID tidak bisa dikonversi ke integer)
--     Data akan di-seed ulang di bawah
TRUNCATE TABLE public.scholarships CASCADE;

-- 3c. Ubah tipe kolom id ke BIGINT
ALTER TABLE public.scholarships
  ALTER COLUMN id TYPE BIGINT USING 0;

-- 3d. Buat sequence dan set sebagai default
CREATE SEQUENCE IF NOT EXISTS public.scholarships_id_seq
  AS BIGINT START WITH 1 INCREMENT BY 1;

ALTER TABLE public.scholarships
  ALTER COLUMN id SET DEFAULT nextval('public.scholarships_id_seq');

ALTER SEQUENCE public.scholarships_id_seq
  OWNED BY public.scholarships.id;


-- ============================================================
-- STEP 4: Buat ulang scholarship_requirements dengan BIGSERIAL
-- ============================================================
CREATE TABLE public.scholarship_requirements (
  id              BIGSERIAL   PRIMARY KEY,
  scholarship_id  BIGINT      NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  requirement_type TEXT       NOT NULL,
  -- Contoh: 'gpa', 'monthly_household_income', 'first_generation',
  --         'semester', 'orphan_status', 'document'
  operator        VARCHAR(10) NOT NULL,
  -- Contoh: '>=', '<=', '=', '>', '<', '!='
  value           TEXT        NOT NULL,
  -- Selalu disimpan sebagai text, parsing dilakukan di aplikasi
  is_required     BOOLEAN     NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_requirements_scholarship_id
  ON public.scholarship_requirements(scholarship_id);

ALTER TABLE public.scholarship_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view requirements"
ON public.scholarship_requirements FOR SELECT
TO authenticated
USING (true);


-- ============================================================
-- STEP 5: Restore FK pada scholarship_applications.scholarship_id
-- ============================================================
ALTER TABLE public.scholarship_applications
  ADD CONSTRAINT scholarship_applications_scholarship_id_fkey
  FOREIGN KEY (scholarship_id) REFERENCES public.scholarships(id) ON DELETE CASCADE;


-- ============================================================
-- STEP 6: Seed ulang data beasiswa
--         ID akan otomatis 1, 2, 3, ... (BIGSERIAL)
-- ============================================================
INSERT INTO public.scholarships (
  title, slug, provider_name, description, benefits,
  funding_type, min_gpa, max_household_income,
  target_first_gen_priority, target_orphan_priority,
  required_docs, deadline, is_active
) VALUES
(
  'Beasiswa Harapan Generasi Utama',
  'beasiswa-harapan-generasi-utama',
  'Yayasan Generasi Emas Indonesia',
  'Beasiswa untuk mahasiswa berprestasi dari keluarga kurang mampu yang memiliki semangat tinggi.',
  'Biaya kuliah s.d. Rp 10.000.000/semester + uang saku Rp 500.000/bulan',
  'partial', 2.75, 5000000,
  false, false,
  ARRAY['KTM', 'KK', 'SKTM', 'Transkrip'],
  '2026-10-07 23:59:59+07', true
),
(
  'Bantuan Tanggap Finansial Yayasan X',
  'bantuan-tanggap-finansial-yayasan-x',
  'Yayasan Peduli Anak Bangsa',
  'Program bantuan cepat untuk mahasiswa yang mengalami kesulitan ekonomi mendadak.',
  'Dana bantuan Rp 3.000.000 (sekali cairai)',
  'partial', 2.50, 6000000,
  false, false,
  ARRAY['KTM', 'SKTM', 'Surat Keterangan Darurat'],
  '2026-10-14 23:59:59+07', true
),
(
  'Program Solidaritas Mahasiswa Mandiri',
  'program-solidaritas-mahasiswa-mandiri',
  'Ikatan Alumni Kampus Bersatu',
  'Beasiswa dari komunitas alumni untuk mendukung mahasiswa adik tingkat yang berprestasi namun terkendala biaya.',
  'Biaya kuliah satu semester + mentoring karir dari alumni',
  'partial', 2.80, 4500000,
  false, false,
  ARRAY['KTM', 'KK', 'Transkrip', 'Essay Motivasi'],
  '2026-10-22 23:59:59+07', true
),
(
  'Beasiswa Bidikmisi KIP-K',
  'bidikmisi-kip-k',
  'Kemdikbud RI',
  'Beasiswa pemerintah untuk mahasiswa dari keluarga kurang mampu yang berprestasi.',
  'Biaya kuliah full + biaya hidup Rp 700.000/bulan',
  'full', 3.00, 4000000,
  true, false,
  ARRAY['KTM', 'KK', 'SKTM', 'Transkrip', 'Rekening Listrik'],
  '2027-03-31 23:59:59+07', true
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
  '2027-01-31 23:59:59+07', true
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
  '2026-12-31 23:59:59+07', true
);


-- ============================================================
-- STEP 7: Seed ulang requirements (ID scholarship sekarang 1-6)
-- ============================================================

-- Beasiswa 1: Harapan Generasi Utama
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
VALUES
  (1, 'gpa',                      '>=', '2.75',    true),
  (1, 'monthly_household_income', '<=', '5000000', true);

-- Beasiswa 2: Bantuan Tanggap Finansial
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
VALUES
  (2, 'gpa',                      '>=', '2.50',    true),
  (2, 'monthly_household_income', '<=', '6000000', true);

-- Beasiswa 3: Solidaritas Mahasiswa Mandiri
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
VALUES
  (3, 'gpa',                      '>=', '2.80',    true),
  (3, 'monthly_household_income', '<=', '4500000', true);

-- Beasiswa 4: Bidikmisi KIP-K
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
VALUES
  (4, 'gpa',                      '>=', '3.00',    true),
  (4, 'monthly_household_income', '<=', '4000000', true),
  (4, 'semester',                 '>=', '1',        true),
  (4, 'document',                 '=',  'SKTM',     true);

-- Beasiswa 5: Yayasan Pendidikan Nusantara
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
VALUES
  (5, 'gpa',                      '>=', '2.75',    true),
  (5, 'orphan_status',            '!=', 'none',    true),
  (5, 'monthly_household_income', '<=', '6000000', false);

-- Beasiswa 6: First Generation Scholarship
INSERT INTO public.scholarship_requirements (scholarship_id, requirement_type, operator, value, is_required)
VALUES
  (6, 'gpa',                      '>=', '3.20',    true),
  (6, 'is_first_generation',      '=',  'true',    true),
  (6, 'monthly_household_income', '<=', '5000000', true);
