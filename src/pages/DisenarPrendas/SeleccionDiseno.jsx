import React, { useEffect, Suspense } from "react";
import { useAuth } from "../../components/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { MousePointer2, Sparkles, Save } from "lucide-react";

function ModelPreview({ glbPath }) {
  const gltf = useGLTF(glbPath);
  
  return (
    <primitive 
      object={gltf.scene} 
      scale={1} 
      position={[0, 0, 0]}
    />
  );
}

function PrendaCard({ prenda, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-blue-900 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative">
        <Canvas
          camera={{ position: prenda.cameraPosition, fov: prenda.cameraFov }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <ModelPreview glbPath={prenda.glb} />
            <Environment preset="studio" />
            {/* Sin OrbitControls - Vista completamente estática */}
          </Suspense>
        </Canvas>
      </div>

      {/* Información de la prenda */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2"> 
          {prenda.nombre}
        </h3>
        <button className="w-full bg-white text-blue-900 hover:bg-blue-200 hover:text-blue-900 font-semibold py-3 rounded-lg transition-colors">
          Personalizar
        </button>
      </div>
    </div>
  );
}

export default function SeleccionDiseno() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Verificando sesión...</div>;
  }

  const prendas = [
    {
      id: "camiseta",
      nombre: "Camiseta",
      descripcion: "Diseña tu camiseta deportiva personalizada",
      glb: "/prendas3d/CamisetaFinal.glb",
      cameraPosition: [0, 2, 5],
      cameraFov: 70,
      ruta: "/modelo3d/camiseta3d/vista/camiseta",
    },
    {
      id: "pantalon",
      nombre: "Pantalón",
      descripcion: "Crea tu pantalón deportivo único",
      glb: "/prendas3d/pantalon_v2.glb",
      cameraPosition: [0, 2, 5],
      cameraFov: 50,
      ruta: "/modelo3d/pantalon3d/vista/pantalon",
    },
    {
      id: "pantaloneta",
      nombre: "Pantaloneta",
      descripcion: "Personaliza tu pantaloneta ideal",
      glb: "/prendas3d/pantaloneta_v1.glb",
      cameraPosition: [0, 1, 4],
      cameraFov: 55,
      ruta: "/modelo3d/pantaloneta3d/vista/pantaloneta",
    },
    {
      id: "chompa",
      nombre: "Chompa",
      descripcion: "Diseña tu chompa deportiva",
      glb: "/prendas3d/chompa_v1.glb",
      cameraPosition: [0, 3, 5],
      cameraFov: 65,
      ruta: "/modelo3d/chompa3d/vista/chompa",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-2">
          <h1 className="text-5xl font-bold text-blue-900 mb-2">
            Diseño en 3D
          </h1>
          <p className="text-xl text-gray-600">
            Elige el tipo de prenda que deseas personalizar
          </p>
        </div>
        <div className="mt-2 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center justify-center">
            <div>
              <div className="text-4xl mb-2 text-blue-900 flex justify-center"><MousePointer2 size={40} /></div>
              <h3 className="font-bold text-lg mb-2">1. Selecciona</h3>
              <p className="text-gray-600">Elige el tipo de prenda que quieres diseñar</p>
            </div>
            <div>
              <div className="text-4xl mb-2 text-blue-900 flex justify-center"><Sparkles size={40} /></div>
              <h3 className="font-bold text-lg mb-2">2. Personaliza</h3>
              <p className="text-gray-600">Cambia colores, añade logos y textos en 3D</p>
            </div>
            <div>
              <div className="text-4xl mb-2 text-blue-900 flex justify-center"><Save size={40} /></div>
              <h3 className="font-bold text-lg mb-2">3. Guarda</h3>
              <p className="text-gray-600">Descarga tu diseño o añádelo al carrito</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {prendas.map((prenda) => (
            <PrendaCard
              key={prenda.id}
              prenda={prenda}
              onClick={() => navigate(prenda.ruta)}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Precarga de modelos para rendimiento
useGLTF.preload("/prendas3d/CamisetaFinal.glb");
useGLTF.preload("/prendas3d/pantalon_v1.glb");
useGLTF.preload("/prendas3d/pantaloneta_v1.glb");
useGLTF.preload("/prendas3d/chompa_v1.glb");
