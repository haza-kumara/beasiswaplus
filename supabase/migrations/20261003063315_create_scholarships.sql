SET local check_function_bodies = off;

CREATE TABLE "public"."profiles" (
  "id"                       uuid                     NOT NULL,
  "full_name"                text,
  "university"               text,
  "study_program"            text,
  "semester"                 integer,
  "gpa"                      numeric(3,2),
  "monthly_household_income" bigint,
  "household_size"           integer,
  "first_generation"         boolean                  NOT NULL DEFAULT false,
  "orphan_status"            boolean                  NOT NULL DEFAULT false,
  "created_at"               timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"               timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_gpa_check" CHECK (((gpa >= (0)::numeric) AND (gpa <= (4)::numeric))),
  CONSTRAINT "profiles_household_size_check" CHECK ((household_size >= 1)),
  CONSTRAINT "profiles_monthly_household_income_check" CHECK ((monthly_household_income >= 0)),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_semester_check" CHECK (((semester >= 1) AND (semester <= 14)))
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."scholarship_requirements" (
  "id"               uuid    NOT NULL DEFAULT gen_random_uuid(),
  "scholarship_id"   uuid    NOT NULL,
  "requirement_type" text    NOT NULL,
  "operator"         text    NOT NULL,
  "value"            text    NOT NULL,
  "is_required"      boolean NOT NULL DEFAULT true,
  CONSTRAINT "scholarship_requirements_operator_check" CHECK ((operator = ANY (ARRAY['='::text, '!='::text, '<'::text, '<='::text, '>'::text, '>='::text, 'in'::text]))),
  CONSTRAINT "scholarship_requirements_pkey" PRIMARY KEY (id),
  CONSTRAINT "scholarship_requirements_requirement_type_check"
    CHECK
    ((requirement_type = ANY (ARRAY['first_generation'::text, 'household_income'::text, 'gpa'::text, 'semester'::text, 'orphan_status'::text, 'study_program'::text,
    'university'::text])))
);

ALTER TABLE "public"."scholarship_requirements"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."scholarships" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "title"           text                     NOT NULL,
  "provider"        text                     NOT NULL,
  "description"     text,
  "application_url" text,
  "min_gpa"         numeric(3,2),
  "max_income"      bigint,
  "deadline"        timestamp with time zone,
  "is_active"       boolean                  NOT NULL DEFAULT true,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"      timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "scholarships_application_url_check" CHECK ((application_url ~* '^https?://'::text)),
  CONSTRAINT "scholarships_max_income_check" CHECK ((max_income >= 0)),
  CONSTRAINT "scholarships_min_gpa_check" CHECK (((min_gpa >= (0)::numeric) AND (min_gpa <= (4)::numeric))),
  CONSTRAINT "scholarships_pkey" PRIMARY KEY (id),
  CONSTRAINT "scholarships_provider_check" CHECK (((char_length(provider) >= 2) AND (char_length(provider) <= 200))),
  CONSTRAINT "scholarships_title_check" CHECK (((char_length(title) >= 3) AND (char_length(title) <= 200)))
);

ALTER TABLE "public"."scholarships"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  AS $function$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
begin
  new.updated_at = now();
  return new;
end $function$;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."scholarship_requirements"
  ADD CONSTRAINT "scholarship_requirements_scholarship_id_fkey" FOREIGN KEY (scholarship_id) REFERENCES public.scholarships(id) ON DELETE CASCADE;

CREATE INDEX idx_scholarship_requirements_scholarship_id ON public.scholarship_requirements USING btree (scholarship_id);

CREATE INDEX idx_scholarships_active_deadline ON public.scholarships USING btree (is_active, deadline);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_scholarships_updated_at
  BEFORE UPDATE ON public.scholarships
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "profiles_insert_own" ON "public"."profiles"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((id = auth.uid()));

CREATE POLICY "profiles_select_own" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = auth.uid()));

CREATE POLICY "profiles_update_own" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((id = auth.uid()))
  WITH CHECK ((id = auth.uid()));

CREATE POLICY "requirements_select" ON "public"."scholarship_requirements"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.scholarships s
  WHERE ((s.id = scholarship_requirements.scholarship_id) AND (s.is_active OR public.is_admin())))));

CREATE POLICY "requirements_write_admin" ON "public"."scholarship_requirements"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "scholarships_delete_admin" ON "public"."scholarships"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "scholarships_insert_admin" ON "public"."scholarships"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "scholarships_select" ON "public"."scholarships"
  FOR SELECT
  TO "authenticated"
  USING (((is_active = true) OR public.is_admin()));

CREATE POLICY "scholarships_update_admin" ON "public"."scholarships"
  FOR UPDATE
  TO "authenticated"
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."set_updated_at"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."scholarship_requirements" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."scholarship_requirements" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."scholarship_requirements" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."scholarship_requirements" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."scholarships" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."scholarships" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."scholarships" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."scholarships" TO "service_role";
