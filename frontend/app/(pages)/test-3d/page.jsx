"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import unify_icon_lightmode from "@/public/images/unify_icon_lightmode.svg";

function Logo3D() {
  const [model, setModel] = React.useState(null);

  React.useEffect(() => {
    const loader = new SVGLoader();
    
    fetch(unify_icon_lightmode.src)
      .then(response => response.text())
      .then(svgData => {
        const svg = loader.parse(svgData);
        
        // Create materials
        const blackMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x121212,
          metalness: 0.5,
          roughness: 0.5,
          side: THREE.DoubleSide
        });
        
        const whiteMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.5,
          side: THREE.DoubleSide
        });

        const meshes = [];
        
        // Process SVG paths
        svg.paths.forEach((path, index) => {
          const shapes = path.toShapes(true);
          shapes.forEach(shape => {
            const extrudeSettings = {
              depth: 0.2,
              bevelEnabled: true,
              bevelThickness: 0.1,
              bevelSize: 0.1,
              bevelSegments: 3
            };
            
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = index === 0 ? blackMaterial : whiteMaterial;
            const mesh = new THREE.Mesh(geometry, material);
            
            // Center the mesh
            geometry.computeBoundingBox();
            const center = new THREE.Vector3();
            geometry.boundingBox.getCenter(center);
            mesh.position.sub(center);
            
            meshes.push(mesh);
          });
        });
        
        setModel(meshes);
      });
  }, []);

  if (!model) return null;

  return (
    <group>
      {model.map((mesh, index) => (
        <primitive 
          key={index} 
          object={mesh} 
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
        />
      ))}
    </group>
  );
}

const Logo3DPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ width: '100vw', height: '100vh' }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Center>
              <Logo3D />
            </Center>
            <OrbitControls 
              enableDamping 
              dampingFactor={0.05}
              minDistance={3}
              maxDistance={10}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
        
        {/* Overlay Text */}
        <div className="absolute top-8 left-8 text-black dark:text-white">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-2"
          >
            Unify Logo
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-neutral-600 dark:text-neutral-400"
          >
            Interactive 3D Model
          </motion.p>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-8 left-8 text-black dark:text-white"
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Click and drag to rotate • Scroll to zoom
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Logo3DPage;
