import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useApi from "../api/axios";

const ProductFormPage = () => {
  const navigate = useNavigate();
  const api = useApi();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.price === "" || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Valid price is required (>= 0)";
    }

    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Valid stock is required (>= 0)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post("/products", {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      navigate("/main");
    } catch (err) {
      const resData = err.response?.data;
      if (resData?.errors && Array.isArray(resData.errors)) {
        const fieldErrors = {};
        resData.errors.forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.msg;
        });
        setErrors(fieldErrors);
      }
      setServerError(resData?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] px-4 py-10 font-outfit text-stone-900">
      <div className="mx-auto max-w-xl">
        <Link
          to="/main"
          className="text-xs font-medium text-stone-500 hover:text-[#003d29] transition flex items-center gap-1.5"
        >
          ← Back to Catalog
        </Link>

        <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-7 sm:p-10 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Add New Product
            </h1>
          
          </div>

          {serverError && (
            <div className="mt-6 rounded-xl bg-rose-50 p-4 text-xs text-rose-600 border border-rose-200 font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 font-normal">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product features, quality, specifications (min 10 characters)..."
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500 font-normal">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1999"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-rose-500 font-normal">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Stock Units
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-rose-500 font-normal">{errors.stock}</p>
                )}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#003d29] py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#002a1c] disabled:opacity-60"
              >
                {submitting ? "Adding to Store..." : "Publish Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProductFormPage;
