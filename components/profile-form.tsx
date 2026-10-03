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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
    };

    startTransition(async () => {
      try {
        await updateProfileAction(rawData);
        setSuccess(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mt-4">
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
