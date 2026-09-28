import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, Navigate, Outlet, useNavigate } from 'react-router'

const MainLayout = () => {
  const { user, loading, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 font-outfit">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#003d29] border-t-transparent"></div>
          <p className="text-sm font-medium text-stone-500">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" />
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-outfit text-stone-900 flex flex-col">
      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Brand Logo - Bold uppercase with accent dot (inspired by SKYMART.) */}
          <Link to="/main" className="flex items-center tracking-tight transition opacity-95 hover:opacity-100">
            <span className="text-[20px] font-medium tracking-wider text-stone-900">
              SHOPCART<span className="text-[#003D29]">.</span>
            </span>
          </Link>

          {/* Right User & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-full border border-stone-200/90 px-3.5 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003D29] text-xs font-bold text-white uppercase">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-stone-800">{user.name}</span>
                <span className="text-[10px] text-stone-500 font-normal">{user.email}</span>
              </div>
            </div>

            {/* Mobile User Initials Avatar */}
            <div className="flex sm:hidden h-8 w-8 items-center justify-center rounded-full bg-[#003D29] text-xs font-bold text-white uppercase" title={user.name}>
              {user.name?.charAt(0) || "U"}
            </div>

            {/* Add Product Button */}
            <Link
              to="/main/products/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#003D29] px-3 py-1.5 sm:px-4 sm:py-2 text-xs text-white shadow-sm transition hover:bg-[#003D29]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden xs:inline sm:inline">Add Product</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="rounded-full border border-stone-300 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-stone-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
