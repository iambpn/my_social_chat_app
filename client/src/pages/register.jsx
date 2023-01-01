import RegisterForm from "../components/RegisterForm";
import LoggedOutLayout from "../layout/LoggedOutLayout";

export default function Register() {
  return (
    <LoggedOutLayout>
      <RegisterForm />
    </LoggedOutLayout>
  );
}
