import { Link } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import BillForm from "../components/BillForm";

export default function CreateBill() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          to="/bills"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to Bills
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
          Create New Bill
        </h1>

        <p className="mt-2 text-muted-foreground">
          Add an expense and split it with your friends.
        </p>
      </div>

      <BillForm />
    </div>
  );
}