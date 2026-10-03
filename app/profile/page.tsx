import ProfileForm from '@/components/profile-form';

export default function ProfilePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-8 items-center">
      <h1 className="text-2xl font-bold">Lengkapkan Profil Anda</h1>
      <p className="text-gray-600 text-center max-w-lg">
        Sila isi maklumat di bawah untuk melengkapkan profil akademik dan latar belakang anda.
      </p>
      
      {/* Memanggil komponen borang dari folder components */}
      <ProfileForm />
    </div>
  );
}