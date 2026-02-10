import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  UserPlus,
  Building2,
  GraduationCap,
  BookOpen,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import Button from "../ui/components/Button";
import Select from "../ui/components/Select";
import { useSignupContext } from "../features/auth/signup/SignupContext";
import { useUpdateUser } from "../features/auth/useUpdateUser";
import { useGetFormData } from "../features/auth/signup/useGetFormData";
import { useUser } from "../features/auth/useUser";

const DEGREE_TYPES = [
  { value: "licence", label: "Licence" },
  { value: "master", label: "Master" },
];

export default function SignupStep3() {
  const navigate = useNavigate();
  const { canAccessStep, resetSignup, markStepCompleted } = useSignupContext();
  const { isUpdating, updateUser } = useUpdateUser();
  const {
    departments,
    specialties,
    levels,
    specialtyLevels,
    isLoading: isLoadingDepartments,
  } = useGetFormData();
  const { user, isAuthenticated } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department: "",
      degreeType: "",
      level: "",
      speciality: "",
    },
  });

  const selectedDepartment = watch("department");
  const selectedDegreeType = watch("degreeType");
  const selectedLevel = watch("level");

  const filteredLevels = levels.filter((level) => {
    if (!selectedDegreeType) return false;
    if (selectedDegreeType === "licence") {
      return level.code?.toUpperCase().startsWith("L");
    }
    if (selectedDegreeType === "master") {
      return level.code?.toUpperCase().startsWith("M");
    }
    return false;
  });

  const filteredSpecialties = specialties.filter((s) => {
    const matchesDept = s.department_id?.toString() === selectedDepartment;
    const matchesDegree =
      !selectedDegreeType || s.degree === selectedDegreeType;
    const matchesLevel =
      !selectedLevel ||
      specialtyLevels.some(
        (sl) =>
          sl.specialty_id?.toString() === s.id?.toString() &&
          sl.level_id?.toString() === selectedLevel,
      );
    return matchesDept && matchesDegree && matchesLevel;
  });

  useEffect(() => {
    if (selectedDepartment) {
      setValue("degreeType", "");
      setValue("level", "");
      setValue("speciality", "");
    }
  }, [selectedDepartment, setValue]);

  useEffect(() => {
    if (selectedDegreeType) {
      setValue("level", "");
      setValue("speciality", "");
    }
  }, [selectedDegreeType, setValue]);

  useEffect(() => {
    if (selectedLevel) {
      setValue("speciality", "");
    }
  }, [selectedLevel, setValue]);

  useEffect(() => {
    const hasIncompleteProfile =
      isAuthenticated && (!user?.level_id || !user?.specialty_id);

    if (hasIncompleteProfile) {
      markStepCompleted(1);
      markStepCompleted(2);
      return;
    }

    if (!canAccessStep(3)) {
      navigate("/signup", { replace: true });
    }
  }, [canAccessStep, navigate, isAuthenticated, user, markStepCompleted]);

  const onSubmit = (data) => {
    updateUser(
      {
        level: data.level,
        speciality: data.speciality,
      },
      {
        onSuccess: () => {
          toast.success("Configuration du compte terminée !");
          resetSignup();
          sessionStorage.removeItem("signup_data");
          navigate("/", { replace: true });
        },
      },
    );
  };

  const isLoading = isUpdating || isLoadingDepartments;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
      <div className="space-y-3 duration-300 md:space-y-4 animate-in fade-in slide-in-from-right">
        <Select
          label="Département"
          icon={Building2}
          placeholder="Sélectionnez votre département"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          disabled={isLoading}
          error={errors.department?.message}
          {...register("department", { required: "Le département est requis" })}
        />

        <Select
          label="Diplôme"
          icon={Award}
          placeholder="Licence ou Master"
          options={DEGREE_TYPES}
          disabled={isLoading || !selectedDepartment}
          error={errors.degreeType?.message}
          {...register("degreeType", {
            required: "Le type de diplôme est requis",
          })}
        />

        <Select
          label="Niveau"
          icon={GraduationCap}
          placeholder={
            selectedDegreeType
              ? "Sélectionnez votre niveau"
              : "Sélectionnez d'abord le diplôme"
          }
          options={filteredLevels.map((l) => ({ value: l.id, label: l.name }))}
          disabled={isLoading || !selectedDegreeType}
          error={errors.level?.message}
          {...register("level", { required: "Le niveau est requis" })}
        />

        <Select
          label="Spécialité"
          icon={BookOpen}
          placeholder={
            selectedLevel
              ? "Sélectionnez votre spécialité"
              : "Sélectionnez d'abord le niveau"
          }
          options={filteredSpecialties.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
          disabled={isLoading || !selectedLevel}
          error={errors.speciality?.message}
          {...register("speciality", { required: "La spécialité est requise" })}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={UserPlus}
        className="w-full"
        disabled={isUpdating}
      >
        {isUpdating ? "Enregistrement..." : "Terminer l'inscription"}
      </Button>

      <p className="mt-4 text-xs text-center md:mt-6 md:text-sm text-slate-600 dark:text-slate-400">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          Connexion
        </Link>
      </p>
    </form>
  );
}
