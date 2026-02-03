import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Mail, Lock, User, Camera, Check } from "lucide-react";
import { useUser } from "../features/auth/useUser";
import { useUpdateUser } from "../features/auth/useUpdateUser";
import Button from "../ui/components/Button";
import Input from "../ui/components/Input";
import Spinner from "../ui/components/Spinner";

export default function Profile() {
  const { user, isLoading: userLoading } = useUser();
  const { isUpdating, updateUser } = useUpdateUser();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || "";
      const names = fullName.split(" ");
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");
      setAvatarPreview(user.user_metadata?.avatar_url || "/image.png");
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("/image.png");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim();
    
    updateUser({
      fullName,
      avatar: avatarFile
    });
  };

  if (userLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-xl md:max-w-lg lg:max-w-4xl 2xl:max-w-full px-2 py-4 sm:px-6 2xl:px-24 2xl:py-2">
      <div className="mb-4 md:mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-3xl 2xl:text-5xl">
          Profil
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 md:text-sm 2xl:text-lg">
          Gérez vos informations personnelles et votre compte.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-5 md:p-4 2xl:p-8 transition-all border shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative group self-center md:self-auto">
              <div className="relative w-24 h-24 md:w-24 overflow-hidden rounded-full ring-4 ring-white dark:ring-zinc-800 shadow-xl md:h-24">
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 -right-0.5 md:right-0 p-1.5 bg-gray-600 rounded-full text-white border-2 border-white dark:border-zinc-800 hover:scale-110 transition-transform shadow-lg md:p-2"
              >
                <Camera className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white md:text-xl">
                  Photo de profil
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto md:mx-0 md:text-sm">
                  Cette photo sera affichée sur votre profil public et dans les discussions de cours.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                <Button
                  onClick={() => fileInputRef.current.click()}
                  variant="primary"
                  icon={Upload}
                  size="md"
                  className="text-xs md:text-sm"
                >
                  Changer la photo
                </Button>
                <Button
                  onClick={handleRemoveAvatar}
                  variant="secondary"
                  icon={Trash2}
                  size="md"
                  className="text-xs md:text-sm"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-6">
          <div className="space-y-6 md:space-y-4 p-6 md:px-4 md:py-4 2xl:p-8 transition-all border shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white md:text-xl 2xl:text-3xl">
              Compte
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
              <Input
                label="Prénom"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Alexandre"
                icon={User}
                inputClassName="md:py-2"
              />
              <Input
                label="Nom"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Dubois"
                icon={User}
                inputClassName="md:py-2"
              />
            </div>

            <Input
              label="Adresse e-mail"
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              icon={Mail}
              hint="L'adresse e-mail ne peut pas être modifiée."
              inputClassName="md:py-3"
            />

            <div className="space-y-1">
              <Input
                label="Mot de passe"
                id="password"
                type="password"
                value="••••••••"
                disabled
                icon={Lock}
                inputClassName="md:py-2"
              />
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 md:text-sm"
                >
                  Changer le mot de passe ?
                </button>
              </div>
            </div>
            
            <div className="pt-4 md:pt-6 border-t border-slate-200 dark:border-zinc-800 flex justify-end">
              <Button
                type="submit"
                isLoading={isUpdating}
                icon={Check}
                loadingText="Enregistrement..."
                className="w-full sm:w-auto md:px-6"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}