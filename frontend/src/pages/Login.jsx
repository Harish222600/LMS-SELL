import loginImg from "../assets/Images/login.png"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back to Beeja Academy"
      description1="Continue your journey of academic excellence and professional growth."
      description2="Unlock your potential with world-class education."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
