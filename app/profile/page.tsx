import ProfileForm from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-8 items-center">
      <h1 className="text-2xl font-bold">Lengkapi Profil</h1>
      <p className="text-muted-foreground text-center max-w-lg">
        Isi informasi di bawah agar sistem dapat mencocokkan kamu dengan beasiswa yang tepat.
      </p>
      <ProfileForm />
    </div>
  );
}
