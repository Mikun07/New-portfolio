import React, { useState } from "react";
import emailjs from "emailjs-com";
import toast , { Toaster } from "react-hot-toast";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function sendMessage(event) {
    event.preventDefault();
    emailjs.send('service_795e8y3' , 'template_ibhw1e9',  {
      user_name: name,
      user_email: email,
      user_subject: subject,
      user_message: message
    }, '8QHScFpSmHReXvlkm').then(result => {
      toast.success('Message Sent!')
    }).catch( error => {
      toast.error("This didn't work.")
    })
  }

  return (
    <>
      <div
        name="contact"
        className="lg:h-screen lg:pt-[60px] md:pt-[250px] sm:pt-[250px] pt-[150px] px-4 flex items-center justify-center bg-gray-200"
      >
        <div className="flex flex-col lg:flex-row sm:flex-col lg:items-center">
          <div className="flex flex-col w-screen contact__data z-10 justify-center items-center">
            <h1 className="section__title-2 capitalize font-bold ">
              <span>Contact.</span>
            </h1>

            <p className="text-justify font-medium mb-[2rem]">
              I will read all emails. Send any message you want and i'll get
              back to you
            </p>

            <p className="text-justify text-sm">
              I need your <span className=" capitalize font-bold">Name</span>{" "}
              and <span className=" capitalize font-bold">Email</span>, but you
              won't receive anything other than your reply.
            </p>

            <div className="geometric-box"></div>
          </div>

          <div className="contact__mail">
            <h2 className="contact__title capitalize">Send Me a Message</h2>

            <form
              onSubmit={sendMessage}
              className="contact__form"
              id="contact-form"
            >
              <div className="grid grid-col-1 gap-6">
                <div className="contact__group lg:w-[700px] grid grid-col-1 lg:grid-cols-3 gap-4">
                  <div className="contact__box">
                    <input
                      type="text"
                      name="user_name"
                      className="contact__input"
                      id="name"
                      placeholder="Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.currentTarget.value)}
                    />
                    <label htmlFor="name" className="contact__label">
                      Name
                    </label>
                  </div>

                  <div className="contact__box">
                    <input
                      type="email"
                      name="user_email"
                      className="contact__input"
                      id="email"
                      placeholder="Email Address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    <label htmlFor="email" className="contact__label">
                      Email Address
                    </label>
                  </div>

                  <div className="contact__box">
                    <input
                      type="text"
                      name="user_subject"
                      className="contact__input"
                      id="subject"
                      placeholder="Subject"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.currentTarget.value)}
                    />
                    <label htmlFor="subject" className="contact__label">
                      Subject
                    </label>
                  </div>
                </div>

                <div className="contact__box contact__area">
                  <textarea
                    name="user_message"
                    id="message"
                    className="contact__input"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    placeholder="Message"
                  ></textarea>
                  <label htmlFor="message" className="contact__label">
                    Message
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="capitalize bg-orange-500 px-4 py-2 text-white flex items-center justify-center gap-1 text-center rounded-sm text-base"
                >
                  <ion-icon name="paper-plane-outline"></ion-icon>
                  send message
                </button>
                <Toaster />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
