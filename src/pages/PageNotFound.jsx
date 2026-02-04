import { useMoveBack } from "../hooks/useMoveBack";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/components/Button";

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl">
        <div className="p-8 border shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl border-white/50 sm:p-12">
          <div className="flex flex-row justify-center">

            <div className="mb-6">
              <h1 className="text-9xl sm:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                404
              </h1>
            </div>

            <div className="">
              <div className="flex items-center justify-center w-20 h-20 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-blue-500/50 animate-bounce">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-bold text-center text-gray-900 sm:text-4xl">
            Page Not Found
          </h2>
          <p className="max-w-md mx-auto mb-8 text-lg text-gray-600">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={moveBack} className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 group bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>

            <Link to="/">
              <Button variant="outline-secondary" icon={Home}>Home Page</Button>
            </Link>
          </div>
        </div>

        <div className="absolute w-16 h-16 -top-8 -right-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 animate-pulse opacity-80"></div>
        <div className="absolute w-12 h-12 rounded-full -bottom-6 -left-6 bg-gradient-to-br from-green-400 to-teal-500 animate-bounce opacity-80"></div>
      </div>
    </div>
  );
}

export default PageNotFound;
