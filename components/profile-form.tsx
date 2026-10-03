<<<<<<< HEAD
'use client';

import { useTransition } from 'react';
import { updateProfileAction } from '@/app/actions/profile'; // Sesuaikan jika nama fail action anda berbeza

export default function ProfileForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const rawData = {
      full_name: formData.get('full_name'),
      university: formData.get('university'),
      study_program: formData.get('study_program'),
      semester: Number(formData.get('semester')),
      gpa: Number(formData.get('gpa')),
      monthly_household_income: Number(formData.get('monthly_household_income')),
      household_size: Number(formData.get('household_size')),
      first_generation: formData.get('first_generation') === 'on',
      orphan_status: formData.get('orphan_status') === 'on',
=======
"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      full_name: formData.get("full_name") as string,
      university: formData.get("university") as string,
      study_program: formData.get("study_program") as string,
      semester: Number(formData.get("semester")),
      gpa: Number(formData.get("gpa")),
      monthly_household_income: Number(formData.get("monthly_household_income")),
      household_size: Number(formData.get("household_size")),
      first_generation: formData.get("first_generation") === "on",
      orphan_status: formData.get("orphan_status") === "on",
>>>>>>> 5871f4e (feat(profile): add profile page, form, service, repo, validation)
    };

    startTransition(async () => {
      try {
<<<<<<< HEAD
        await updateProfileAction(rawData as any);
        alert('Profil berjaya disimpan!');
      } catch (error: any) {
        alert(`Ralat: ${error.message}`);
=======
        await updateProfileAction(rawData);
        setSuccess(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
>>>>>>> 5871f4e (feat(profile): add profile page, form, service, repo, validation)
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mt-4">
<<<<<<< HEAD
      <input name="full_name" placeholder="Nama Penuh" required className="border border-gray-300 p-2 rounded text-black" />
      <input name="university" placeholder="Universiti" required className="border border-gray-300 p-2 rounded text-black" />
      <input name="study_program" placeholder="Program Pengajian" required className="border border-gray-300 p-2 rounded text-black" />
      <input name="semester" type="number" placeholder="Semester (cth: 3)" required min="1" max="14" className="border border-gray-300 p-2 rounded text-black" />
      <input name="gpa" type="number" step="0.01" placeholder="CGPA / IPK (cth: 3.50)" required min="0" max="4" className="border border-gray-300 p-2 rounded text-black" />
      <input name="monthly_household_income" type="number" placeholder="Pendapatan Isi Rumah (RM/Rp)" required className="border border-gray-300 p-2 rounded text-black" />
      <input name="household_size" type="number" placeholder="Jumlah Tanggungan/Saiz Isi Rumah" required className="border border-gray-300 p-2 rounded text-black" />
      
      <label className="flex items-center gap-2 cursor-pointer">
        <input name="first_generation" type="checkbox" className="w-4 h-4" /> 
        Generasi Pertama Universiti
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input name="orphan_status" type="checkbox" className="w-4 h-4" /> 
        Status Anak Yatim
      </label>

      <button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded mt-2 disabled:opacity-50 transition-colors">
        {isPending ? 'Menyimpan...' : 'Simpan Profil'}
      </button>
    </form>
  );
}
=======
      <div className="grid gap-2">
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input id="full_name" name="full_name" placeholder="Nama lengkap" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="university">Universitas</Label>
        <Input id="university" name="university" placeholder="Nama universitas" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="study_program">Program Studi</Label>
        <Input id="study_program" name="study_program" placeholder="Contoh: Teknik Informatika" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="semester">Semester</Label>
        <Input id="semester" name="semester" type="number" placeholder="Contoh: 3" required min={1} max={14} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="gpa">IPK</Label>
        <Input id="gpa" name="gpa" type="number" step="0.01" placeholder="Contoh: 3.50" required min={0} max={4} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="monthly_household_income">Penghasilan Rumah Tangga / Bulan (Rp)</Label>
        <Input id="monthly_household_income" name="monthly_household_income" type="number" placeholder="Contoh: 3000000" required min={0} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="household_size">Jumlah Anggota Keluarga</Label>
        <Input id="household_size" name="household_size" type="number" placeholder="Contoh: 4" required min={1} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input name="first_generation" type="checkbox" className="w-4 h-4" />
        Generasi pertama kuliah di keluarga
      </label>
      <label className="flex items-center gap-2 cursor-pointer text-sm">
        <input name="orphan_status" type="checkbox" className="w-4 h-4" />
        Yatim / yatim piatu
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Profil berhasil disimpan!</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Profil"}
      </Button>
    </form>
  );
}
>>>>>>> 5871f4e (feat(profile): add profile page, form, service, repo, validation)
