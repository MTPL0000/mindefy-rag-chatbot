"use client";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Mail, Lock, User, Calendar, ChevronDown, Check } from "lucide-react";
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
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef(null);
  const dateInputRef = useRef(null);
  const [dobDisplay, setDobDisplay] = useState("");

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setIsGenderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenderSelect = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
    setIsGenderDropdownOpen(false);
    if (validationErrors.gender) {
      setValidationErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  const getGenderLabel = () => {
    const selected = genderOptions.find((opt) => opt.value === formData.gender);
    return selected ? selected.label : "Select gender";
  };

  // Handle native date picker change
  const handleNativeDateChange = (e) => {
    const isoDate = e.target.value; // yyyy-mm-dd
    if (isoDate) {
      const [yyyy, mm, dd] = isoDate.split("-");
      setDobDisplay(`${mm}/${dd}/${yyyy}`);
      setFormData((prev) => ({ ...prev, dob: isoDate }));
      if (validationErrors.dob) {
        setValidationErrors((prev) => ({ ...prev, dob: "" }));
      }
    }
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

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
          <p className="text-sm mt-1 text-gray-600">
            Start your wellness journey today
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
                  placeholder="Enter Name"
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
                  placeholder="Enter password"
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                />

                {/* Date Input - Calendar only */}
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    {/* Display field - read only, clicking opens calendar */}
                    <button
                      type="button"
                      onClick={openDatePicker}
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 text-left cursor-pointer
                        ${dobDisplay ? "text-gray-900" : "text-gray-400"}
                        ${
                          validationErrors.dob
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      style={{
                        "--tw-ring-color": validationErrors.dob
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(51, 39, 113, 0.2)",
                      }}
                    >
                      {dobDisplay || "mm/dd/yyyy"}
                    </button>
                    {/* Hidden native date input for calendar picker - positioned to open below */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleNativeDateChange}
                      max={new Date().toISOString().split("T")[0]}
                      className="absolute top-full left-0 opacity-0 w-full h-0 pointer-events-none"
                      tabIndex={-1}
                    />
                    {/* Calendar icon */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-12 pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {validationErrors.dob && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <span>{validationErrors.dob}</span>
                    </div>
                  )}
                </div>

                <div className="relative" ref={genderDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 text-left flex items-center justify-between
                      ${formData.gender ? "text-gray-900" : "text-gray-400"}
                      ${
                        validationErrors.gender
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                          : isGenderDropdownOpen
                          ? "border-[#332771] bg-gray-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    style={{
                      "--tw-ring-color": validationErrors.gender
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(51, 39, 113, 0.2)",
                    }}
                  >
                    <span>{getGenderLabel()}</span>
                  </button>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-12 pointer-events-none">
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isGenderDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                  
                  {/* Custom Dropdown Menu */}
                  {isGenderDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                      {genderOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleGenderSelect(option.value)}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between
                            ${formData.gender === option.value ? "bg-gray-50 font-medium text-gray-900" : "text-gray-600"}`}
                        >
                          <span>{option.label}</span>
                          {formData.gender === option.value && (
                            <Check className="w-4 h-4 text-[#332771]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
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
