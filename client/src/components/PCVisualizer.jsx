import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, Outlines } from '@react-three/drei';

// Component for a single product model
function ProductModel({ modelUrl, position, title }) {
  const { scene } = useGLTF(modelUrl);

  return (
    <group position={position}>
      {/* Outline effect around the model */}
      <primitive object={scene} scale={1}>
        <Outlines
          thickness={0.02}    // outline width
          color="white"       // outline color
          opacity={1}         // fully visible
          transparent={false} // solid outline
          screenspace={false} // works in world space
        />
      </primitive>

      {/* Label above model */}
      <Html position={[0, 1.5, 0]}>
        <div className="info-bubble">{title}</div>
      </Html>
    </group>
  );
}

// Main visualizer component
export default function PCVisualizer({ products }) {
  const modelsToShow = products.filter(p => p.model3DUrl);

  return (
    <div className="visualizer-wrapper">
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[0, 10, 0]} intensity={0.8} />

        {/* Optional helper */}
        <gridHelper args={[20, 20, `#333`, `#333`]} />

        <Suspense fallback={null}>
          {/* Default central setup */}
          <ProductModel
            modelUrl="/Fullsetup.glb"
            position={[0, 0, 0]}
            title="Full Setup"
          />

          {/* Add user-added parts */}
          {modelsToShow.map((product, index) => (
            <ProductModel
              key={product._id}
              modelUrl={product.model3DUrl}
              title={product.title}
              position={[(index + 1) * 2, 0, 0]}
            />
          ))}
        </Suspense>

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
