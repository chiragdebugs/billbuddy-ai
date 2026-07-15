import AuthLayout from "../components/AuthLayout";
import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Welcome to BillBuddy AI."
    >
      <SignUpForm />
    </AuthLayout>
  );
}