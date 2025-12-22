"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Mail, Lock, User, Calendar, Users } from "lucide-react";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";

export default function SignupForm() {
  const { signup, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else if (new Date(formData.dob) > new Date()) {
      errors.dob = "Date of birth cannot be in the future";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
    });

    if (result.success) {
      setSuccessMessage(
        "Your request has been submitted to the Admin. He will review and approve it. Once approved, you will receive confirmation via email."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header with AskDocs branding */}
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex items-center justify-center">
            <Image src="/logo.svg" alt="AskDocs" width={72} height={72} />
          </div>
          <h1 className="text-xl text-[#332771] font-bold tracking-wide">
            AskDocs
          </h1>
          <p className="text-sm mt-1 text-black">
          Start your smart guidance journey today
          </p>
        </div>
        {/* Show success message instead of form */}
        {successMessage ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p
              className="font-medium mb-5 text-[#332771]"
            >
              {successMessage}
            </p>
            <Link
              href="/login"
              className="font-medium text-[#332771] hover:text-[#d93311] transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Create an account
              </h2>
              <p className="text-gray-500 text-sm">
                or{" "}
                <Link
                  href="/login"
                  className="font-medium underline text-[#332771] hover:text-[#d93311] transition-colors duration-200"
                >
                  SignIn
                </Link>
              </p>
            </div>

            <form
              className="bg-white rounded-xl shadow-md p-5"
              onSubmit={handleSubmit}
            >
              <div className="space-y-3">
                <InputField
                  icon={User}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={validationErrors.username}
                  placeholder="Enter username"
                />

                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={validationErrors.email}
                  placeholder="Enter email"
                />

                <InputField
                  icon={Lock}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={validationErrors.password}
                  placeholder="Create a password"
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                />

                <InputField
                  icon={Calendar}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  error={validationErrors.dob}
                  placeholder="Date of birth"
                  max={new Date().toISOString().split("T")[0]}
                />

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 appearance-none ${
                      formData.gender ? "text-black" : "text-gray-400"
                    } ${
                      validationErrors.gender
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200"
                    }`}
                    style={{
                      "--tw-ring-color": validationErrors.gender
                        ? "#ef4444"
                        : "#332771",
                    }}
                  >
                    <option value="" disabled hidden>
                      Select gender
                    </option>
                    <option value="male" className="text-black">
                      Male
                    </option>
                    <option value="female" className="text-black">
                      Female
                    </option>
                    <option value="other" className="text-black">
                      Other
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {validationErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.gender}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center pt-4">
                  <Button type="submit" isLoading={isLoading} className="w-35">
                    SignUp
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
        {/* Social Login */}
        <SocialLoginButtons />
      </div>
    </div>
  );
}
