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

export default function Experience({ imageLocation }) {
  const {
    posX,
    posY,
    posZ,
    main,
    buttons_ab,
    dPad,
    buttons_selStart,
    luminanceThreshold,
  } = useControls("General", {
    posX: {
      value: -1.97,
      min: -4,
      max: 4,
      step: 0.01,
    },
    posY: {
      value: -2.05,
      min: -4,
      max: 4,
      step: 0.01,
    },
    posZ: {
      value: 0.67,
      min: -4,
      max: 4,
      step: 0.01,
    },
    luminanceThreshold: {
      value: 8.0,
      min: -4,
      max: 10,
      step: 0.01,
    },
    main: "#f5f5f5",
    buttons_ab: "#e85497",
    dPad: "#5f5f5f",
    buttons_selStart: "#aaaaaa",
  });

  let colors = { main, buttons_ab, dPad, buttons_selStart };
  const { width, height } = useThree((state) => state.viewport);

  return (
    <>
      <EffectComposer>
        <Bloom
          mipmapBlur
          intensity={10.0}
          luminanceThreshold={luminanceThreshold}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <color args={["#0F172B"]} />

      <OrbitControls makeDefault />

      <Environment preset="city" environmentIntensity={1.5} />

      <group position={[0, -0.5, 0.5]}>
        <Float rotationIntensity={1.8}>
          <Gameboy {...{ imageLocation, colors, posX, posY, posZ }} />
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
