"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/rag-chatbot/store/authStore";
import { Mail, Lock } from "lucide-react";
import SocialLoginButtons from "@/features/rag-chatbot/components/SocialLoginButtons";
import InputField from "@/features/rag-chatbot/components/InputField";
import Button from "@/features/rag-chatbot/components/Button";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/askdocs/chat");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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

    const result = await login(formData);
    if (result.success) {
      router.replace("/askdocs/chat");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header with AskDocs branding */}
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex items-center justify-center">
            <Image src="/logo.svg" alt="AskDocs" width={72} height={72} />
          </div>
          <h1 className="text-xl text-[#332771] font-bold tracking-wide">
            AskDocs
          </h1>
          <p className="text-sm mt-1 text-gray-600">
            Welcome back to your knowledge assistant
          </p>
        </div>

        {/* Login Form */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            SignIn to your account
          </h2>
          <p className="text-gray-500 text-sm">
            or{" "}
            <Link
              href="signup"
              className="font-medium underline text-[#332771] hover:text-[#d93311] transition-colors duration-200"
            >
              SignUp
            </Link>
          </p>
        </div>

        <form
          className="bg-white rounded-xl shadow-md p-5"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3">
            <InputField
              icon={Mail}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={validationErrors.username}
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

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex items-center justify-center pt-2">
              <Button type="submit" isLoading={isLoading} className="w-35">
                SignIn
              </Button>
            </div>
          </div>
        </form>

        {/* Social Login */}
        <SocialLoginButtons />
      </div>
    </div>
  );
}
