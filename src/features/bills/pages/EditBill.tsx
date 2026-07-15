import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { billService } from "../services/bill.service";

export default function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBill = async () => {
      const bills = await billService.getBills();

      const bill = bills.find(
        (item: any) => item.id === id
      );

      if (bill) {
        setTitle(bill.title);
        setAmount(String(bill.amount));
        setDescription(bill.description || "");
      }
    };

    loadBill();
  }, [id]);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!id) return;

    try {
      setLoading(true);

      await billService.updateBill(id, {
        title,
        amount: Number(amount),
        description,
      });

      navigate(`/bills/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update bill");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">

        <h1 className="mb-6 text-3xl font-bold">
          Edit Bill
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="font-medium">
              Bill Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="mt-2 w-full rounded-xl border p-3"
            />
          </div>


          <div>
            <label className="font-medium">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="mt-2 w-full rounded-xl border p-3"
            />
          </div>


          <div>
            <label className="font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="mt-2 h-32 w-full rounded-xl border p-3"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
    </main>
  );
}