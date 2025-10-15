// src/pages/Contacto.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus({
        type: 'success',
        message: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
      });
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: ""
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-2xl text-blue-600" />,
      title: "Dirección",
      content: "Av. Principal #123, Col. Centro, Ciudad de México, CDMX, 06000",
      link: "https://maps.google.com"
    },
    {
      icon: <FaPhone className="text-2xl text-blue-600" />,
      title: "Teléfono",
      content: "+52 55 1234 5678",
      link: "tel:+525512345678"
    },
    {
      icon: <FaEnvelope className="text-2xl text-blue-600" />,
      title: "Correo Electrónico",
      content: "contacto@johansports.com",
      link: "mailto:contacto@johansports.com"
    },
    {
      icon: <FaClock className="text-2xl text-blue-600" />,
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábado: 10:00 AM - 3:00 PM"
    }
  ];

  const socialMedia = [
    { icon: <FaFacebook className="text-2xl" />, name: "Facebook", url: "https://facebook.com" },
    { icon: <FaInstagram className="text-2xl" />, name: "Instagram", url: "https://instagram.com" },
    { icon: <FaWhatsapp className="text-2xl" />, name: "WhatsApp", url: "https://wa.me/525512345678" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Contáctanos
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl max-w-3xl mx-auto"
            >
              Estamos aquí para ayudarte. Envíanos un mensaje o visita nuestras instalaciones.
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-gray-900">Información de Contacto</h2>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="bg-blue-100 p-3 rounded-full">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                        {item.link ? (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Síguenos en Redes Sociales</h3>
                  <div className="flex space-x-4">
                    {socialMedia.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -3 }}
                        className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Ubicación</h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.3514505387715!2d-77.70830087158639!3d0.8239224999477921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2968db83cb879f%3A0xf42e2a87f4bfa96b!2sPedro%20Moncayo%2C%20Tulc%C3%A1n!5e0!3m2!1sen!2sec!4v1760038854863!5m2!1sen!2sec"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Ubicación de Johan Sports"
                      className="rounded-xl"
                    ></iframe>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
                
                {submitStatus && (
                  <div 
                    className={`mb-6 p-4 rounded-lg ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
                      Asunto <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows="5"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                        isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-900 hover:bg-blue-800'
                      }`}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "¿Cuál es el tiempo de entrega de los pedidos?",
                  answer: "El tiempo de entrega varía según el tipo de producto y personalización. Generalmente, los pedidos estándar se envían en 3-5 días hábiles. Los productos personalizados pueden tardar entre 7-14 días hábiles."
                },
                {
                  question: "¿Cuáles son los métodos de pago aceptados?",
                  answer: "Aceptamos pagos con transferencia bancaria."
                },
                
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contacto;