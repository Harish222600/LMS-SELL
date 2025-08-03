import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import Img from './../../common/Img';

function Template({ title, description1, description2, image, formType }) {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
        <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
          <div className="classic-card p-8 lg:p-10">
            <h1 className="classic-heading text-3xl lg:text-4xl text-academic-navy-900 mb-6">
              {title}
            </h1>
            <p className="mb-8 text-lg leading-relaxed">
              <span className="text-academic-slate-600">{description1}</span>{" "}
              <span className="font-playfair font-bold italic text-academic-gold-700">
                {description2}
              </span>
            </p>

            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
        </div>

        <div className="relative max-w-[550px] md:mx-0 my-0">
          <div className="relative overflow-hidden rounded-2xl shadow-elegant">
            <Img
              src={image}
              alt={formType}
              className="min-w-[105%] h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-academic-navy-900/20 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Template
