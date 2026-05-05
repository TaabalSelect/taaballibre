import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, ContactShadows } from "@react-three/drei";
import { MotionValue, useTransform } from "framer-motion";
import * as THREE from "three";

function Glass({ progress }: { progress: MotionValue<number> }) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const limeRef = useRef<THREE.Group>(null);
  const saltRef = useRef<THREE.Mesh>(null);
  const iceRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = progress.get();
    if (liquidRef.current) {
      const fill = THREE.MathUtils.smoothstep(p, 0.45, 0.95);
      liquidRef.current.scale.y = Math.max(0.001, fill);
      liquidRef.current.position.y = -0.55 + fill * 0.55;
      (liquidRef.current.material as any).opacity = fill > 0.02 ? 0.9 : 0;
    }
    if (saltRef.current) {
      const s = THREE.MathUtils.smoothstep(p, 0.25, 0.55);
      saltRef.current.scale.setScalar(s);
    }
    if (limeRef.current) {
      const l = THREE.MathUtils.smoothstep(p, 0.05, 0.3);
      limeRef.current.position.set(1.2 - l * 1.0, 1.4 - l * 0.5, 0);
      limeRef.current.rotation.z = (1 - l) * 1.4;
      limeRef.current.scale.setScalar(l * 0.9 + 0.05);
    }
    if (iceRef.current) {
      iceRef.current.children.forEach((c, i) => {
        const t = THREE.MathUtils.smoothstep(p, 0.55 + i * 0.04, 0.78 + i * 0.04);
        c.position.y = THREE.MathUtils.lerp(2.5, -0.2 + i * 0.18, t);
        c.rotation.x = (1 - t) * 4 + i;
        c.rotation.z = (1 - t) * 3 - i * 0.7;
        (c as any).visible = t > 0.01;
      });
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Stem */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.4, 32]} />
        <MeshTransmissionMaterial thickness={0.4} roughness={0.05} transmission={1} ior={1.45} chromaticAberration={0.04} backside />
      </mesh>
      {/* Foot */}
      <mesh position={[0, -2.3, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 64]} />
        <MeshTransmissionMaterial thickness={0.3} roughness={0.1} transmission={1} ior={1.45} />
      </mesh>
      {/* Glass bowl (margarita coupe) */}
      <mesh>
        <coneGeometry args={[1.6, 1.6, 64, 1, true]} />
        <MeshTransmissionMaterial
          thickness={0.5} roughness={0.02} transmission={1} ior={1.5}
          chromaticAberration={0.06} anisotropy={0.3} distortion={0.2} distortionScale={0.3}
          temporalDistortion={0.05} backside attenuationDistance={2}
          attenuationColor="#ffffff" color="#ffffff"
        />
      </mesh>
      {/* Liquid (margarita green-yellow) */}
      <mesh ref={liquidRef} position={[0, -0.55, 0]} scale={[1, 0.001, 1]}>
        <coneGeometry args={[1.55, 1.55, 64]} />
        <meshPhysicalMaterial
          color="#d4e85a" transmission={0.6} thickness={1.2} roughness={0.1}
          ior={1.34} attenuationColor="#9bc94a" attenuationDistance={1.2}
          transparent opacity={0.9} clearcoat={1}
        />
      </mesh>
      {/* Salt rim */}
      <mesh ref={saltRef} position={[0, 0.78, 0]} scale={[0.001, 0.001, 0.001]}>
        <torusGeometry args={[1.58, 0.06, 24, 96]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.0} emissive="#fff8e1" emissiveIntensity={0.05} />
      </mesh>
      {/* Ice cubes */}
      <group ref={iceRef}>
        {[0, 1, 2].map(i => (
          <mesh key={i} position={[(i - 1) * 0.4, 2.5, (i % 2) * 0.2 - 0.1]} rotation={[0.4, i, 0.3]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <MeshTransmissionMaterial
              thickness={0.35} roughness={0.15} transmission={1} ior={1.31}
              chromaticAberration={0.08} distortion={0.1} backside
              attenuationColor="#e6f5ff" attenuationDistance={0.8}
            />
          </mesh>
        ))}
      </group>
      {/* Lime wedge */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
        <group ref={limeRef} position={[1.2, 1.4, 0]} rotation={[0, 0, 0.4]}>
          <mesh>
            <sphereGeometry args={[0.32, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshPhysicalMaterial color="#c2e857" roughness={0.4} clearcoat={1} clearcoatRoughness={0.2} sheen={1} sheenColor="#a8d044" />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.31, 0.31, 0.04, 32]} />
            <meshPhysicalMaterial color="#f4ffb8" roughness={0.6} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.25;
    }
  });
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 8, 5]} intensity={1.2} angle={0.4} penumbra={1} castShadow color="#fff1c4" />
      <spotLight position={[-5, 3, 2]} intensity={0.6} color="#a85cff" />
      <spotLight position={[0, -2, 6]} intensity={0.5} color="#ff8a3d" />
      <group ref={groupRef}>
        <Glass progress={progress} />
      </group>
      <ContactShadows position={[0, -2.4, 0]} opacity={0.6} blur={2.5} scale={6} far={4} />
      <Environment preset="studio" background={false} />
    </>
  );
}

export function Margarita3D({ progress }: { progress: MotionValue<number> }) {
  // Smooth scale for the canvas itself
  const scale = useTransform(progress, [0, 0.5, 1], [0.85, 1.05, 1]);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
