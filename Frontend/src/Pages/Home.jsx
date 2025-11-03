import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className=" rounded-3xl shadow-2xl max-w-md w-full p-10 text-center transition transform hover:scale-105">
        
        <h1 className="text-4xl font-extrabold text-white mb-3">IntelliTask</h1>
        <p className="text-gray-400 text-lg mb-8 italic">Work Smarter</p>
        <Link to="/login">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform hover:scale-105">
            Get Started
          </button>
        </Link>

        <p className="text-gray-500 text-sm mt-4">
          Join thousands of developers who manage tasks smarter.
        </p>
      </div>
    </div>
    );
}
