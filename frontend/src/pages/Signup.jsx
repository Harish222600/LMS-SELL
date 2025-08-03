import signupImg from "../assets/Images/signup.png"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Begin Your Academic Journey with Beeja Academy"
      description1="Build skills for today, tomorrow, and beyond with world-class education."
      description2="Transform your future through the power of learning."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
