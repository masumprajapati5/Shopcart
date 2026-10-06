import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import useApi from "../api/axios";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const api = useApi();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data?.data?.products || []);
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const name = p.name ? p.name.toLowerCase() : "";
      const desc = p.description ? p.description.toLowerCase() : "";
      const term = searchTerm.toLowerCase();
      return name.includes(term) || desc.includes(term);
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "stock") {
      result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }

    return result;
  }, [products, searchTerm, sortBy]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 font-outfit">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 text-xl font-bold border border-rose-100">
            !
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-stone-500">{error}</p>
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              fetchProducts();
            }}
            className="mt-4 rounded-full bg-[#003d29] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#00281b]"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-20 font-outfit text-stone-900">
      
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
          
          <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-20 font-outfit">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-tight">
              Latest Arrivals
            </h1>

            <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-stone-600 leading-relaxed">
              Explore our curated selection of verified premium products designed with quality, function, and modern living in mind.
            </p>

            <div className="mt-6 sm:mt-8 flex items-center">
              <Link
                to="/main/products/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#003D29] px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm tracking-wide text-white shadow-sm transition hover:bg-[#002a1c] focus:outline-none focus:ring-2 focus:ring-[#003D29] focus:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Product</span>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] w-full">
            <img
              src="/hero-lifestyle.jpg"
              alt="Latest Arrivals Collection"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
      </section>

      <main id="catalog-section" className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              Products For You!
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-normal">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Product..."
                className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs font-normal text-stone-800 outline-none shadow-xs transition placeholder:text-stone-400 focus:border-[#003d29] focus:ring-1 focus:ring-[#003d29]"
              />
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium text-stone-800 shadow-xs outline-none transition hover:border-stone-300 focus:border-[#003d29]"
              >
                <option value="newest">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock Quantity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#003d29] border-t-transparent"></div>
              <p className="text-xs text-stone-500 font-medium">Loading catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#003d29]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0-2.5 3H6.5L4 13m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-stone-900">
                No products found
              </h3>
              <p className="mt-1 text-xs text-stone-500 max-w-sm">
                {searchTerm
                  ? `We couldn't find any products matching "${searchTerm}". Try a different keyword.`
                  : "Your store currently has no products. Start by adding your first product."}
              </p>
              <Link
                to="/main/products/new"
                className="mt-5 rounded-full bg-[#003d29] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#002a1c]"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
