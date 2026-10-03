'use server';

import { createClient } from '@/lib/supabase/server'; // Sesuaikan path jika berbeda
import { fetchUserProfile, saveUserProfile } from '@/lib/services/profiles';
import { ProfileInput } from '@/lib/validations/profile';

export async function getProfileAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Anda belum login.');

  return await fetchUserProfile(supabase, user.id);
}

export async function updateProfileAction(formData: ProfileInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Anda belum login.');

  return await saveUserProfile(supabase, user.id, formData);
}