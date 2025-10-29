import React from 'react'
import { ArrowLeft } from 'lucide-react'
import BookstoreLogo from './BookstoreLogo'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const AuthLayout = ({
  children,
  title,
  subtitle,
  alternateLink,
  alternateLinkText,
}) => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-gray-50 dark:*:bg-gray-900">
      {/* Left side - Bookstore branding */}
      <div className="flex-col items-center justify-center hidden p-8 md:flex md:w-1/2 bg-emerald-50">
        <div className="mb-4 mr-96">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:hover:text-gray-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
        </div>
        <div className="max-w-md mx-auto text-center">
          <BookstoreLogo size="large" />
          <h2 className="mt-6 text-2xl font-medium text-gray-700 dark:text-gray-300 md:text-3xl">
            Your favorite books, just a click away
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Discover thousands of books across all genres. Sign in to explore
            our vast collection and enjoy personalized recommendations.
          </p>
          <div className="mt-10">
            <img
              src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
              alt="Books on shelf"
              className="h-auto max-w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
      {/* Right side - Auth form */}
      <div className="flex flex-col items-center justify-center w-full p-4 md:w-1/2 md:p-8">
        <div className="mb-8 md:hidden">
          <BookstoreLogo />
        </div>
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl dark:text-gray-200">
            {title}
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-300">{subtitle}</p>
          {children}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {alternateLink.text}{' '}
              <Link
                to={alternateLink.href}
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {alternateLinkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthLayout
