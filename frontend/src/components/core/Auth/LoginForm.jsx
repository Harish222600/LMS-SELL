import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex w-full flex-col gap-y-6"
    >
      <label className="w-full">
        <p className="mb-3 text-sm font-medium text-academic-slate-700">
          Email Address <sup className="text-red-500">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="classic-input"
        />
      </label>

      <label className="relative w-full">
        <p className="mb-3 text-sm font-medium text-academic-slate-700">
          Password <sup className="text-red-500">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="classic-input pr-12"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-[42px] z-[10] cursor-pointer text-academic-slate-400 hover:text-academic-slate-600 transition-colors"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={20} />
          ) : (
            <AiOutlineEye fontSize={20} />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-2 ml-auto max-w-max text-sm text-academic-gold-600 hover:text-academic-gold-700 transition-colors font-medium">
            Forgot Password?
          </p>
        </Link>
      </label>

      <button
        type="submit"
        className="btn-elegant w-full py-4 text-lg font-bold mt-4"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm
