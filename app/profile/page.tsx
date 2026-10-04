import { requireUser } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"
import { PageTitle } from "@/components/ui/page-title"
import { ProfileForm, type ProfileValues } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: p, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  if (error) throw new Error(error.message)

  const str = (x: unknown) => (x === null || x === undefined ? "" : String(x))

  const initial: ProfileValues = {
    full_name: str(p?.full_name),
    university: str(p?.university),
    study_program: str(p?.study_program),
    semester: str(p?.semester),
    gpa: str(p?.gpa),
    monthly_household_income: str(p?.monthly_household_income),
    household_size: str(p?.household_size),
    first_generation: Boolean(p?.first_generation),
    orphan_status: Boolean(p?.orphan_status),
  }

  return (
    <>
      <PageTitle title="Profil" subtitle="Data ini dipakai untuk mencocokkan kamu dengan beasiswa. Hanya kamu yang bisa melihatnya." />
      <ProfileForm userId={user.id} initial={initial} />
    </>
  )
}
