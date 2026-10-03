import { SupabaseClient } from '@supabase/supabase-js';
import { profileSchema, ProfileInput } from '../validations/profile';
import { getProfileById, upsertProfile } from '../repositories/profiles';

export async function fetchUserProfile(supabase: SupabaseClient, userId: string) {
  return await getProfileById(supabase, userId);
}

export async function saveUserProfile(supabase: SupabaseClient, userId: string, rawData: ProfileInput) {
  // 1. Validasi input dari frontend
  const validatedData = profileSchema.parse(rawData);

  // 2. Siapkan payload dan tempelkan ID user yang sedang login
  const payload = {
    id: userId,
    ...validatedData,
    updated_at: new Date().toISOString(),
  };

  // 3. Simpan ke database
  return await upsertProfile(supabase, payload);
}