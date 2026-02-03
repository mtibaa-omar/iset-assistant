import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserPlus, Building2, GraduationCap, BookOpen, Award } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../ui/components/Button";
import Select from "../ui/components/Select";
import { useSignupContext } from "../features/auth/signup/SignupContext";
import { useUpdateUser } from "../features/auth/useUpdateUser";
import { useGetFormData } from "../features/auth/signup/useGetFormData";

const DEGREE_TYPES = [
  { value: "licence", label: "Licence" },
  { value: "master", label: "Master" },
];

export default function SignupStep3() {
  const navigate = useNavigate();
  const { canAccessStep, resetSignup } = useSignupContext();
  const { isUpdating, updateUser } = useUpdateUser();
  const { departments, specialties, levels, specialtyLevels, isLoading: isLoadingDepartments } = useGetFormData();

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
    const matchesDegree = !selectedDegreeType || s.degree === selectedDegreeType;
    const matchesLevel = !selectedLevel || specialtyLevels.some(
      (sl) =>
        sl.specialty_id?.toString() === s.id?.toString() &&
        sl.level_id?.toString() === selectedLevel
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
    if (!canAccessStep(3)) {
      navigate("/signup", { replace: true });
    }
  }, [canAccessStep, navigate]);

  const onSubmit = (data) => {
    updateUser(
      { 
        level: data.level, 
        speciality: data.speciality 
      },
      {
        onSuccess: () => {
          toast.success("Account setup complete!");
          navigate("/");
          setTimeout(() => resetSignup(), 100);
        },
      }
    );
  };

  const isLoading = isUpdating || isLoadingDepartments;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
      <div className="space-y-3 md:space-y-4 duration-300 animate-in fade-in slide-in-from-right">
        <Select
          label="Department"
          icon={Building2}
          placeholder="Select your department"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          disabled={isLoading}
          error={errors.department?.message}
          {...register("department", { required: "Department is required" })}
        />

        <Select
          label="Degree"
          icon={Award}
          placeholder="Licence or Master"
          options={DEGREE_TYPES}
          disabled={isLoading || !selectedDepartment}
          error={errors.degreeType?.message}
          {...register("degreeType", { required: "Degree type is required" })}
        />

        <Select
          label="Level"
          icon={GraduationCap}
          placeholder={selectedDegreeType ? "Select your level" : "Select degree first"}
          options={filteredLevels.map((l) => ({ value: l.id, label: l.name }))}
          disabled={isLoading || !selectedDegreeType}
          error={errors.level?.message}
          {...register("level", { required: "Level is required" })}
        />

        <Select
          label="Speciality"
          icon={BookOpen}
          placeholder={selectedLevel ? "Select your speciality" : "Select level first"}
          options={filteredSpecialties.map((s) => ({ value: s.id, label: s.name }))}
          disabled={isLoading || !selectedLevel}
          error={errors.speciality?.message}
          {...register("speciality", { required: "Speciality is required" })}
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
        {isUpdating ? "Saving..." : "Complete signup"}
      </Button>

      <p className="mt-4 md:mt-6 text-xs md:text-sm text-center text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
