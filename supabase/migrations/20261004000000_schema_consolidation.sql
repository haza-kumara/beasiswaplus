-- ============================================================
-- Migration: Schema Consolidation
-- BeasiswaPlus — 2026-10-04
-- Purpose: Align base schema with branch implementations
-- ============================================================

-- ============================================================
-- 1. ADD is_admin() FUNCTION
--    Required by applications and emergency_requests RLS
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin',
    false
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'Checks if current authenticated user has admin role via app_metadata';


-- ============================================================
-- 2. RENAME document_vault → documents
--    Match branch implementation naming
-- ============================================================
ALTER TABLE public.document_vault RENAME TO documents;

-- Rename indexes
ALTER INDEX idx_documents_user_id RENAME TO idx_documents_user_id_legacy;

-- Rename policies (must drop and recreate - policies cannot be renamed)
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "documents_own_select" ON public.documents
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "documents_own_insert" ON public.documents
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "documents_own_delete" ON public.documents
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Rename trigger
DROP TRIGGER IF EXISTS set_document_vault_updated_at ON public.documents;
CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3. DROP UNUSED scholarship_applications TABLE
--    Branch uses 'applications' instead
-- ============================================================
DROP TABLE IF EXISTS public.scholarship_applications CASCADE;

-- Drop associated enum (only used by scholarship_applications)
DROP TYPE IF EXISTS public.application_status_enum CASCADE;


-- ============================================================
-- 4. DROP UNUSED emergency_grants TABLE
--    Branch uses 'emergency_requests' instead
-- ============================================================
DROP TABLE IF EXISTS public.emergency_grants CASCADE;


-- ============================================================
-- 5. VERIFY CRITICAL DEPENDENCIES
-- ============================================================
-- Verify profiles table exists (required by emergency trigger)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    RAISE EXCEPTION 'profiles table missing - required for schema consolidation';
  END IF;
END $$;

-- Verify set_updated_at function exists (required by triggers)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    RAISE EXCEPTION 'set_updated_at function missing - required for triggers';
  END IF;
END $$;
