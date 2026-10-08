import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useApi from "../api/axios";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const getProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.data.product);
    } catch {
      setError("Could not load this product or it does not exist.");
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      navigate("/main");
    } catch (err) {
      alert("Failed to delete product: " + (err.response?.data?.message || err.message));
    }
  };

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 font-outfit">
        <p className="text-rose-500 font-medium text-sm">{error}</p>
        <Link
          to="/main"
          className="mt-4 rounded-full bg-[#003d29] px-5 py-2 text-xs font-bold text-white"
        >
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center font-outfit">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#003d29] border-t-transparent"></div>
        <p className="mt-3 text-xs text-stone-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] px-4 py-8 sm:px-6 lg:px-8 font-outfit text-stone-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-2 text-xs text-stone-500">
          <Link to="/main" className="hover:text-[#003d29] transition font-medium">
            Products
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#f5f6f6] p-8 border border-stone-100 min-h-[380px]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm text-[#003d29]">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-medium text-[#003d29]">Verified Inventory Product</p>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                    {product.name}
                  </h1>
                  {product.stock === 0 ? (
                    <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 border border-rose-200">
                      Sold Out
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-[#003d29] border border-emerald-200">
                      In Stock
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-stone-600 font-normal">
                  {product.description}
                </p>

                <div className="mt-6 pb-6 border-b border-stone-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#003d29]">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-stone-400 font-normal">or suggested financing</span>
                  </div>
                  <p className="mt-1 text-xs text-[#003d29] font-normal">
                    Free Delivery & 30-Day Return Guarantee
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-stone-700">Quantity</span>
                    <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-2 text-stone-500 hover:text-stone-900"
                      >
                        -
                      </button>
                      <span className="px-2 text-stone-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => (product.stock ? Math.min(product.stock, q + 1) : q))}
                        className="px-2 text-stone-500 hover:text-stone-900"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-xs font-normal text-stone-500">
                    Only <strong className="text-stone-900 font-medium">{product.stock} items</strong> left in stock!
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/main/products/${product._id}/update`}
                    className="flex items-center justify-center rounded-full border border-stone-300 bg-white py-2.5 text-xs font-medium text-stone-800 transition hover:bg-stone-50"
                  >
                    Edit Product
                  </Link>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 py-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                  >
                    Delete Product
                  </button>
                </div>

                <Link
                  to="/main"
                  className="block text-center text-xs font-medium text-stone-500 hover:text-[#003d29] pt-2"
                >
                  ← Return to Products Catalog
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
