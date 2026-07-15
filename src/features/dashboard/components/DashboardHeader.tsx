import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {

  const navigate = useNavigate();


  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold">
          👋 Welcome Back
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your expenses and recent activity.
        </p>
      </div>


      <button
        onClick={() => navigate("/create-bill")}
        className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
      >
        + New Bill
      </button>


    </div>
  );
}