// src/pages/SobreNosotros.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTshirt, FaPalette, FaShieldAlt, FaTruck, FaUsers, FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SobreNosotros = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <FaTshirt className="text-4xl text-blue-600 mb-4" />,
      title: "Diseño Personalizado",
      description: "Crea prendas únicas con nuestro diseñador 3D."
    },
    {
      icon: <FaPalette className="text-4xl text-blue-600 mb-4" />,
      title: "Amplia Variedad",
      description: "Elige entre múltiples colores y estilos."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-600 mb-4" />,
      title: "Calidad Garantizada",
      description: "Materiales y costuras reforzadas para mayor durabilidad."
    },
    {
      icon: <FaTruck className="text-4xl text-blue-600 mb-4" />,
      title: "Envíos Rápidos",
      description: "Entrega rápida y segura a todo el país."
    }
  ];

  const team = [
    {
      name: "Johan Martínez",
      role: "Fundador & Diseñador Principal",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Apasionado por el diseño y la innovación en prendas deportivas."
    },
    {
      name: "María González",
      role: "Directora de Operaciones",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Experta en gestión de producción y control de calidad."
    },
    {
      name: "Carlos Ramírez",
      role: "Desarrollador Web",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      bio: "Encargado de crear experiencias digitales excepcionales."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Sobre Johan Sports
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Innovación y calidad en cada puntada. Creando experiencias únicas en ropa deportiva desde 2002.
          </motion.p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Fundada en 2002, Johan Sports nació de la pasión por el deporte y la moda. 
              Comenzamos como un pequeño taller y hoy somos una marca reconocida por nuestra 
              innovación en diseño y calidad en prendas deportivas personalizadas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img 
                src="./img/TallerJS.png" 
                alt="TallerJS.png" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg w-3/4">
                <h3 className="text-xl font-bold mb-2">Johan Sports</h3>
                <p>Comercialización de Ropa Deportiva</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 mb-6">
                Proporcionar prendas deportivas de alta calidad que combinen estilo, 
                comodidad y rendimiento, permitiendo a nuestros clientes expresar su 
                identidad única a través del diseño personalizado.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-600">
                Ser líderes en innovación en el mercado de ropa deportiva personalizada, 
                expandiendo nuestra presencia a nivel internacional mientras mantenemos 
                nuestro compromiso con la calidad y la satisfacción del cliente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestras Ventajas */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Elegirnos?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              En Johan Sports nos esforzamos por superar tus expectativas en cada detalle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conoce a Nuestro Equipo</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Profesionales apasionados que hacen posible la magia detrás de Johan Sports.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">¿Listo para crear tu diseño único?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Únete a miles de clientes satisfechos que ya han creado sus prendas personalizadas con nosotros.
            </p>
            <Link
              to="/disenar"
              className="inline-block bg-white text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Comenzar a Diseñar
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SobreNosotros;