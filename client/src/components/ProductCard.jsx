import { Link, useNavigate } from "react-router";

const ProductCard = ({ product, handleDelete }) => {
  const navigate = useNavigate();
  const totalStock = product.stock ?? 0;

  const handleUpdate = () => {
    navigate(`/main/products/${product._id}/update`);
  };

  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-stone-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#003d29]/30 hover:shadow-md font-outfit">
      
      <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-[#f5f6f6] transition group-hover:bg-[#eef2f0]">
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs text-[#003d29]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-stone-500">
            Catalog Item
          </span>
        </div>

        <div className="absolute top-3 left-3">
          {totalStock === 0 ? (
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-600 border border-rose-200">
              Sold Out
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-[#003d29] border border-emerald-200">
              In Stock ({totalStock})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <Link
          to={`/main/products/${product._id}`}
          className="min-w-0 flex-1"
        >
          <h2 className="line-clamp-1 text-sm font-semibold text-stone-900 transition hover:text-[#003d29]">
            {product.name}
          </h2>
        </Link>
        <span className="shrink-0 text-sm font-bold text-stone-900">
          ₹{product.price}
        </span>
      </div>

      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500 font-normal">
        {product.description}
      </p>


      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => navigate(`/main/products/${product._id}`)}
          className="rounded-full border border-stone-200 bg-white py-1.5 text-xs font-medium text-stone-700 transition hover:border-[#003d29] hover:text-[#003d29]"
        >
          View
        </button>

        <button
          type="button"
          onClick={handleUpdate}
          className="rounded-full border border-stone-200 bg-stone-50 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => handleDelete(product._id)}
          className="rounded-full border border-rose-200 bg-rose-50/60 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
