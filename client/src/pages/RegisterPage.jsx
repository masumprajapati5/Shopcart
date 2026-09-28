import React, { useState } from "react";
import { useAuth } from "../hooks/authHooks";

const RegisterPage = () => {
  const {
    register,
    handleRegister,
    errors,
    serverError,
    handleSubmit,
    navigate,
    loading,
    watch
  } = useAuth();

  const [successMsg, setSuccessMsg] = useState("");
  const password = watch("password");

  const onSubmit = async (data) => {
    setSuccessMsg("");
    const isSuccess = await handleRegister(data);
    if (isSuccess) {
      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4 font-outfit text-stone-900">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xs">
        
        <h1 className="text-2xl font-bold text-center text-stone-900">
          Register
        </h1>
        <p className="text-center text-stone-500 mb-6 text-sm mt-1 font-normal">
          Create an account to continue
        </p>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {serverError}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#003d29] text-xs font-medium">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Name cannot exceed 20 characters",
                },
              })}
            />

            {errors.name && (
              <p className="text-rose-500 text-xs mt-1 font-normal">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Email Address
            </label>

            <input
              type="email"
              placeholder="user@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="text-rose-500 text-xs mt-1 font-normal">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Password
            </label>

            <input
              type="password"
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-rose-500 text-xs mt-1 font-normal">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            {errors.confirmPassword && (
              <p className="text-rose-500 text-xs mt-1 font-normal">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#003d29] text-white text-sm font-semibold rounded-xl hover:bg-[#002a1c] transition shadow-xs disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-stone-500 mt-6 font-normal">
          Already have an account?{" "}
          <span 
            onClick={() => navigate("/")}
            className="text-[#003d29] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
