import LoginForm from "../components/LoginForm";
import LoggedOutLayout from "../layout/LoggedOutLayout";

export default function Login() {
  return (
    <LoggedOutLayout>
      <LoginForm />
    </LoggedOutLayout>
  );
}
