import {
  useTexture,
  OrbitControls,
  useGLTF,
  Environment,
  Stage,
  PresentationControls,
  Float,
  ContactShadows,
} from "@react-three/drei";
import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "@react-three/fiber";
import { MeshStandardMaterial, Vector3, TextureLoader, Box3 } from "three";
import { useControls } from "leva";
import {
  ToneMapping,
  EffectComposer,
  Bloom,
  Scanline,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

import Gameboy from "./components/Gameboy";

export default function Experience({ setShader }) {
  const { width, height } = useThree((state) => state.viewport);

  return (
    <>
      <EffectComposer>
        <Bloom mipmapBlur intensity={10.0} luminanceThreshold={8.0} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <color args={["#0F172B"]} />

      <OrbitControls makeDefault />

      <Environment preset="city" environmentIntensity={1.5} />

      <group position={[0, -0.5, 0.5]}>
        <Float rotationIntensity={1.8}>
          <Gameboy {...{ setShader }} />
        </Float>
      </group>
    </>
  );
}
{
  /* <PresentationControls
global
polar={[-0.9, 0.9]}
azimuth={[-2.0, 2.0]}
config={{ mass: 2, tension: 400 }} */
}
