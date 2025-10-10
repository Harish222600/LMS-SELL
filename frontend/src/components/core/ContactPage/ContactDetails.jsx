import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon3 from "react-icons/hi2"
import * as Icon2 from "react-icons/io5"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat on us",
    description: "Our friendly team is here to help.",
    details: ["info@lms.com"],
  },
  {
    icon: "BiWorld",
    heading: "Our Location",
    description: [
      {
        label: "Main Office:",
        text: "123 Sample Street, Business District, Sample City, SC 12345",
        link: "View on Google Maps",
        url: "https://maps.google.com",
        iframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcxOC4yIk4gNzPCsDU5JzA4LjUiVw!5e0!3m2!1sen!2sus!4v1234567890"
      },
      {
        label: "Training Centre:",
        text: "456 Learning Avenue, Education Hub, Sample City, SC 67890",
        link: "View on Google Maps",
        url: "https://maps.google.com",
        iframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcxOC4yIk4gNzPCsDU5JzA4LjUiVw!5e0!3m2!1sen!2sus!4v1234567890"
      },
    ]
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: ["+1 (555) 123-4567"],
  },
  {
    icon: "IoPeopleSharp",
    heading: "Partnership Request",
    description: "For partnership and business development inquiries",
    details: ["partner@lms.com", "+1 (555) 987-6543"],
  },
]

const ContactDetails = () => {
  return (
    <div className="classic-card p-6 lg:p-8 bg-gradient-to-br from-academic-navy-900 to-academic-navy-800 text-white">
      <div className="space-y-8">
        {contactDetails.map((ele, i) => {
          let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
          return (
            <div
              className="flex flex-col gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              key={i}
            >
              <div className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 bg-academic-gold-500 rounded-xl flex items-center justify-center">
                  <Icon size={24} className="text-white" />
                </div>
                <h1 className="elegant-heading text-white">
                  {ele?.heading}
                </h1>
              </div>

              {Array.isArray(ele.description) ? (
                <div className="flex flex-col gap-6 ml-16">
                  {ele.description.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div>
                        <p className="font-semibold text-academic-gold-300 mb-2">{item.label}</p>
                        <p className="text-academic-slate-200 leading-relaxed">{item.text}</p>
                        {item.link && (
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-academic-gold-400 hover:text-academic-gold-300 underline text-sm mt-2 transition-colors"
                          >
                            {item.link}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                      {item.iframe && (
                        <div className="w-full h-[200px] rounded-xl overflow-hidden mt-3 border-2 border-academic-gold-500/30">
                          <iframe
                            src={item.iframe}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ml-16">
                  <p className="text-academic-slate-200 mb-3">{ele?.description}</p>
                  {Array.isArray(ele.details) ? (
                    <div className="flex flex-col gap-2">
                      {ele.details.map((detail, idx) => (
                        <p key={idx} className="font-semibold text-academic-gold-300 text-lg">
                          {detail}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="font-semibold text-academic-gold-300 text-lg">{ele.details}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactDetails
