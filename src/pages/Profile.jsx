import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Mail, Lock, User, Camera, Check, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUser } from "../features/auth/useUser";
import { useUpdateUser } from "../features/auth/useUpdateUser";
import Button from "../ui/components/Button";
import Input from "../ui/components/Input";
import Spinner from "../ui/components/Spinner";
import Modal from "../ui/components/Modal";

export default function Profile() {
  const { user, isLoading: userLoading } = useUser();
  const { isUpdating, updateUser } = useUpdateUser();
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || "";
      const names = fullName.split(" ");
      setValue("firstName", names[0] || "");
      setValue("lastName", names.slice(1).join(" ") || "");
      setAvatarPreview(user.user_metadata?.avatar_url || "/image.png");
    }
  }, [user, setValue]);

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

  const handleProfileSubmit = (data) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    
    updateUser({
      fullName,
      avatar: avatarFile
    },{
      onSuccess: () => {
        toast.success("Profil mis à jour avec succès !");
      }
    } );
  };

  const handlePasswordChange = (data) => {
    updateUser(
      { password: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Mot de passe mis à jour avec succès !");
          setShowPasswordModal(false);
          resetPasswordForm();
        },
      }
    );
  };

  if (userLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  return (
    <>
    <div className="max-w-xl px-6 overflow-y-auto md:max-w-lg lg:max-w-4xl 2xl:max-w-full sm:px-6 2xl:px-24 2xl:py-2">
      <div className="mb-4 md:mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-3xl 2xl:text-5xl">
          Profil
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 md:text-sm 2xl:text-lg">
          Gérez vos informations personnelles et votre compte.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-5 transition-all border shadow-sm md:p-4 2xl:p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative self-center group md:self-auto">
              <div className="relative w-24 h-24 overflow-hidden rounded-full shadow-xl md:w-24 ring-4 ring-white dark:ring-zinc-800 md:h-24">
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
                <p className="max-w-sm mx-auto mt-1 text-xs text-slate-500 dark:text-zinc-400 md:mx-0 md:text-sm">
                  Cette photo sera affichée sur votre profil public et dans les discussions de cours.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start md:gap-4">
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

        <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6 md:space-y-6">
          <div className="p-6 space-y-6 transition-all border shadow-sm md:space-y-4 md:px-4 md:py-4 2xl:p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white md:text-xl 2xl:text-3xl">
              Compte
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
              <Input
                label="Prénom"
                id="firstName"
                placeholder="Omar"
                icon={User}
                inputClassName="md:py-2"
                error={errors.firstName?.message}
                {...register("firstName", {
                  required: "Le prénom est requis",
                })}
              />
              <Input
                label="Nom"
                id="lastName"
                placeholder="Mtibaa"
                icon={User}
                inputClassName="md:py-2"
                error={errors.lastName?.message}
                {...register("lastName", {
                  required: "Le nom est requis",
                })}
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
                  onClick={() => setShowPasswordModal(true)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 md:text-sm"
                >
                  Changer le mot de passe ?
                </button>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t md:pt-6 border-slate-200 dark:border-zinc-800">
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

    <Modal
      isOpen={showPasswordModal}
      onClose={() => {
        setShowPasswordModal(false);
        resetPasswordForm();
      }}
      title="Changer le mot de passe"
      maxWidth="max-w-md"
    >
      <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="p-6 space-y-4">
        <Input
          id="newPassword"
          type="password"
          label="Nouveau mot de passe"
          placeholder="••••••••"
          icon={Lock}
          error={passwordErrors.newPassword?.message}
          disabled={isUpdating}
          {...registerPassword("newPassword", {
            required: "Le nouveau mot de passe est requis",
            minLength: {
              value: 8,
              message: "Au moins 8 caractères",
            },
          })}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirmer le nouveau mot de passe"
          placeholder="••••••••"
          icon={Lock}
          error={passwordErrors.confirmPassword?.message}
          disabled={isUpdating}
          {...registerPassword("confirmPassword", {
            required: "Veuillez confirmer votre mot de passe",
            validate: (value) =>
              value === watch("newPassword") || "Les mots de passe ne correspondent pas",
          })}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setShowPasswordModal(false);
              resetPasswordForm();
            }}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            isLoading={isUpdating}
            loadingText="Mise à jour..."
            className="flex-1"
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
    </>
  );
}