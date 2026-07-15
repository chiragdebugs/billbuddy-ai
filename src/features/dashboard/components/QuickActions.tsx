import { useNavigate } from "react-router-dom";

export default function QuickActions() {

  const navigate = useNavigate();


  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold">
        Quick Actions
      </h2>


      <div className="grid gap-6 md:grid-cols-3">


        <button
          onClick={() => navigate("/create-bill")}
          className="rounded-2xl border p-6 text-left transition hover:bg-slate-50"
        >

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 text-2xl">
            +
          </div>


          <h3 className="text-lg font-semibold">
            Create Bill
          </h3>


          <p className="mt-1 text-slate-500">
            Add a new expense
          </p>

        </button>



        <button
          onClick={() => navigate("/groups")}
          className="rounded-2xl border p-6 text-left transition hover:bg-slate-50"
        >

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            👥
          </div>


          <h3 className="text-lg font-semibold">
            New Group
          </h3>


          <p className="mt-1 text-slate-500">
            Split with friends
          </p>

        </button>



        <button
          onClick={() => navigate("/upload-receipt")}
          className="rounded-2xl border p-6 text-left transition hover:bg-slate-50"
        >

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            🧾
          </div>


          <h3 className="text-lg font-semibold">
            Upload Receipt
          </h3>


          <p className="mt-1 text-slate-500">
            Scan expenses
          </p>

        </button>


      </div>

    </section>
  );
}