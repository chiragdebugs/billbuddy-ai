import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { billService } from "../services/bill.service";

interface Participant {
  id: string;
  name: string;
  amount_owed: number;
  status: string;
  paid_at: string | null;
}

interface Bill {
  id: string;
  title: string;
  amount: number;
  description: string | null;
  participants: Participant[];
}

export default function BillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchBill = async () => {
    try {
      const bills = await billService.getBills();

      const selectedBill = bills.find(
        (item: any) => item.id === id
      );

      setBill(selectedBill || null);

    } catch (error) {
      console.error("Failed to fetch bill:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBill();
  }, [id]);


  const handleMarkPaid = async (participantId: string) => {
    try {
      console.log("Marking paid:", participantId);

      await billService.markParticipantPaid(
        participantId
      );

      await fetchBill();

    } catch (error) {
      console.error(
        "Failed to mark participant paid:",
        error
      );

      alert("Failed to update payment");
    }
  };


  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bill?"
    );

    if (!confirmDelete) return;

    try {
      await billService.deleteBill(id);

      alert("Bill deleted successfully 🗑️");

      navigate("/bills");

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete bill");
    }
  };


  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }


  if (!bill) {
    return (
      <div className="p-10">
        Bill not found
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">

      <div className="mx-auto max-w-5xl space-y-6">


        <Link
          to="/bills"
          className="text-emerald-600 hover:underline"
        >
          ← Back to Bills
        </Link>



        <section className="rounded-2xl border bg-white p-8 shadow-sm">

          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-4xl font-bold">
                {bill.title}
              </h1>

              <p className="mt-2 text-slate-500">
                {bill.description || "No description"}
              </p>
            </div>


            <div className="flex gap-3">

              <button
                onClick={() =>
                  navigate(`/bills/${id}/edit`)
                }
                className="rounded-xl bg-emerald-600 px-5 py-3 text-white"
              >
                Edit
              </button>


              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-500 px-5 py-3 text-white"
              >
                Delete
              </button>

            </div>

          </div>


          <div className="mt-6">
            <p className="text-slate-500">
              Total Amount
            </p>

            <h2 className="text-4xl font-bold text-emerald-600">
              ₹{bill.amount}
            </h2>
          </div>


        </section>



        <section className="rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">
            Participants
          </h2>


          <div className="space-y-4">

            {bill.participants?.map((person) => (

              <div
                key={person.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >

                <div>

                  <p className="text-lg font-medium">
                    {person.name}
                  </p>

                  <p className="text-slate-500">
                    ₹{person.amount_owed}
                  </p>

                </div>



                <div className="flex items-center gap-3">

                  {
                    person.status === "Paid"
                    ?
                    (
                      <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
                        Paid ✅
                      </span>
                    )
                    :
                    (
                      <>
                        <span className="rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">
                          Pending
                        </span>


                        <button
                          onClick={() =>
                            handleMarkPaid(person.id)
                          }
                          className="rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800"
                        >
                          Mark Paid
                        </button>
                      </>
                    )
                  }

                </div>


              </div>

            ))}

          </div>


        </section>


      </div>

    </main>
  );
}