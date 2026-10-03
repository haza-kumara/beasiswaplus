CREATE POLICY "User dapat mengubah profil sendiri" 
ON profiles FOR UPDATE USING (auth.uid() = id);