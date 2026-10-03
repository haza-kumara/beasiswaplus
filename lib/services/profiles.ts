import type { SupabaseClient } from "@supabase/supabase-js";
import { profileSchema, type ProfileInput } from "../validations/profile";
import { getProfileById, upsertProfile } from "../repositories/profiles";

export async function fetchUserProfile(supabase: SupabaseClient, userId: string) {
  return await getProfileById(supabase, userId);
}

export async function saveUserProfile(
  supabase: SupabaseClient,
  userId: string,
  rawData: ProfileInput,
) {
  const validatedData = profileSchema.parse(rawData);
  const payload = {
    id: userId,
    ...validatedData,
    updated_at: new Date().toISOString(),
  };
  return await upsertProfile(supabase, payload);
}
