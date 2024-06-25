import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  TransformControls,
  useGLTF,
  shaderMaterial,
  Stage,
  useTexture,
} from "@react-three/drei";
import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
import { MeshStandardMaterial, Vector3, TextureLoader, Box3 } from "three";
import {
  ToneMapping,
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { useControls } from "leva";

// DEFAUlT SHADER
import screenVertexShader from "../shaders/screen/vertex.glsl";
import screenFragmentShader from "../shaders/screen/fragment.glsl";

// MOSAIC SHADER
import mosaicVertexShader from "../shaders/mosaic/vertex.glsl";
import mosaicFragmentShader from "../shaders/mosaic/fragment.glsl";

// MOSAIC SHADER
import crtVertexShader from "../shaders/crt/vertex.glsl";
import crtFragmentShader from "../shaders/crt/fragment.glsl";

// NEWSPAPER SHADER
import newsVertexShader from "../shaders/newspaper/vertex.glsl";
import newsFragmentShader from "../shaders/newspaper/fragment.glsl";

// SECRETCLUB SHADER
import secretVertexShader from "../shaders/secretClub/vertex.glsl";
import secretFragmentShader from "../shaders/secretClub/fragment.glsl";

// DOGE2MOON SHADER
import dogeVertexShader from "../shaders/doge/vertex.glsl";
import dogeFragmentShader from "../shaders/doge/fragment.glsl";

// DEFAULT SHADER MATERIAL
const ScreenMaterial = shaderMaterial(
  {
    uPictureTexture: null,
    uRows: 40,
    uColumns: 50,
    uBarHeight: 0.3,
    uTime: 0,
    uBrightness: 1.49,
    uBarWidth: 0.05,
    uBarWidthGap: 0.05,
    uThreshold: 0.59,
  },
  screenVertexShader,
  screenFragmentShader
);

// DOGE SHADER MATERIAL
const DogeMaterial = shaderMaterial(
  {
    uPictureTexture: null,
    uSprite: null,
    uRows: 40,
    uColumns: 50,
    uBarHeight: 0.3,
    uTime: 0,
    uBrightness: 1.49,
    uBarWidth: 0.05,
    uBarWidthGap: 0.05,
    uThreshold: 0.59,
  },
  dogeVertexShader,
  dogeFragmentShader
);

// MOSAIC SHADER MATERIAL
const MosaicMaterial = shaderMaterial(
  {
    uTexture1: null,
    uTexture2: null,
    uTexture3: null,
    uTexture4: null,
    uTexture5: null,
    uAspectRatio: 4 / 5,
    uTime: 0,
  },
  mosaicVertexShader,
  mosaicFragmentShader
);

// CRT SHADER MATERIAL
const CrtMaterial = shaderMaterial(
  {
    uPictureTexture: null,
    uTime: 0,
  },
  crtVertexShader,
  crtFragmentShader
);

// NEWSPAPER MATERIAL
const NewsMaterial = shaderMaterial(
  {
    uPictureTexture: null,
    uTime: 0,
  },
  newsVertexShader,
  newsFragmentShader
);

// NEWSPAPER MATERIAL
const SecretMaterial = shaderMaterial(
  {
    uTexture1: null,
    uTexture2: null,
    uAspectRatio: 4 / 5,
    uTime: 0,
  },
  secretVertexShader,
  secretFragmentShader
);

extend({
  ScreenMaterial,
  MosaicMaterial,
  CrtMaterial,
  NewsMaterial,
  SecretMaterial,
  DogeMaterial,
});

// START

export default function Gameboy({ setShader }) {
  const { nodes, materials } = useGLTF("model/gameboy-Jun18.glb");
  const shaderRef = useRef();
  let posZ = 0.67;

  /**
   * Shader Settings
   */

  const mosaic1 = useLoader(TextureLoader, "./mosaic/image1.png");
  const mosaic2 = useLoader(TextureLoader, "./mosaic/image2.png");
  const mosaic3 = useLoader(TextureLoader, "./mosaic/image3.png");
  const mosaic4 = useLoader(TextureLoader, "./mosaic/image4.png");
  const mosaic5 = useLoader(TextureLoader, "./mosaic/image5.png");

  const newspaper = useLoader(TextureLoader, "./newspaper/newspaper.png");

  const bubble1 = useLoader(TextureLoader, "./secretClub/blue.png");
  const bubble2 = useLoader(TextureLoader, "./secretClub/gray.png");

  const workingOnIt = useLoader(TextureLoader, "./visualCV/visualCV.png");

  const doge = useLoader(TextureLoader, "./doge/doge.png");
  const dog = useLoader(TextureLoader, "./doge/dog.png");

  useEffect(() => {
    switch (setShader) {
      case "doge":
        shaderRef.current.uPictureTexture = doge;
        shaderRef.current.uSprite = dog;
        break;
      case "mosaic":
        shaderRef.current.uTexture1 = mosaic1;
        shaderRef.current.uTexture2 = mosaic2;
        shaderRef.current.uTexture3 = mosaic3;
        shaderRef.current.uTexture4 = mosaic4;
        shaderRef.current.uTexture5 = mosaic5;
        break;
      case "crtShader":
        shaderRef.current.uPictureTexture = mosaic5;
        break;
      case "newspaper":
        shaderRef.current.uPictureTexture = newspaper;
        break;
      case "secretClub":
        shaderRef.current.uTexture1 = bubble1;
        shaderRef.current.uTexture2 = bubble2;
        break;
      case "visualCV":
        shaderRef.current.uPictureTexture = workingOnIt;
      default:
        shaderRef.current.uPictureTexture = workingOnIt;
        break;
    }
  }, [
    setShader,
    mosaic1,
    mosaic2,
    mosaic3,
    mosaic4,
    mosaic5,
    bubble1,
    bubble2,
  ]);

  /**
   * Load the texture for the screen
   */
  const mouse = useRef();

  const plastic_main = new MeshStandardMaterial({ color: "#f5f5f5" });
  const plastic_buttons_ab = new MeshStandardMaterial({
    color: "#e85497",
  });
  const plastic_dPad = new MeshStandardMaterial({ color: "#5f5f5f" });
  const plastic_buttons_selStart = new MeshStandardMaterial({
    color: "#aaaaaa",
  });
  const plastic_cartridge = new MeshStandardMaterial({ color: "yellow" });
  const plastic_black = new MeshStandardMaterial({ color: "black" });

  /**
   * Create button object & functions
   */

  // UpdateZ position based of current & target position
  const updateZ = function (delta, speed) {
    let target = this.targetZ;
    let actual = this.ref.current.position.z;

    if (Math.abs(target - actual) > 0.01) {
      actual += Math.sign(target - actual) * delta * speed;
    } else {
      actual = target;
    }

    this.ref.current.position.z = actual;
    //console.log(`${this.name} has target: ${target} and actual: ${actual} `)
  };

  // UpdateY rotation based of current & target rotation
  const updateYRotation = function (delta, speed) {
    let target = this.targetYRotation;
    let actual = this.ref.current.rotation.y;
    if (Math.abs(target - actual) > 0.01) {
      actual += Math.sign(target - actual) * delta * speed;
    } else {
      actual = target;
    }

    this.ref.current.rotation.y = actual;
  };

  // UpdateX rotation based of current & target rotation
  const updateXRotation = function (delta, speed) {
    let target = this.targetXRotation;
    let actual = this.ref.current.rotation.x;

    if (Math.abs(target - actual) > 0.01) {
      actual += Math.sign(target - actual) * delta * speed;
    } else {
      actual = target;
    }

    this.ref.current.rotation.x = actual;
  };

  // Create button function
  const createButton = (additionalProps = {}) => ({
    ref: useRef(),
    targetZ: 0.0,
    targetYRotation: 0.0,
    targetXRotation: 0.0,
    updateZ,
    updateYRotation,
    updateXRotation,
    ...additionalProps,
  });

  // Create persistent reference for buttons
  const buttonsRef = useRef({
    a: createButton({ name: "a" }),
    b: createButton({ name: "b" }),
    select: createButton({ name: "select" }),
    start: createButton({ name: "start" }),
    dPad: createButton({ name: "dPad" }),
  });

  const button = buttonsRef.current;

  /**
   * Reset the dPad position to origin (to fix pivot misalignment) & set default button target z positions
   */
  const vec = new Vector3();
  useEffect(() => {
    if (
      button.a.ref.current &&
      button.b.ref.current &&
      button.select.ref.current &&
      button.start.ref.current
    ) {
      button.a.targetZ = button.a.ref.current.position.z;
      button.b.targetZ = button.b.ref.current.position.z;
      button.select.targetZ = button.select.ref.current.position.z;
      button.start.targetZ = button.start.ref.current.position.z;
      button.dPad.targetZ = button.dPad.ref.current.position.z;
    }
  }, []);

  /**
   * Update the frame
   */
  useFrame((state, delta) => {
    //Set movement speed for animation
    const speed = 0.6;
    // Update Z positions
    for (const buttonName in button) {
      if (button[buttonName].ref.current) {
        button[buttonName].updateZ(delta, speed);
      }
    }

    // Update dPad Y Rotation
    button.dPad.updateYRotation(delta, speed);

    // Update dPad X Rotation
    button.dPad.updateXRotation(delta, speed);

    //Update Shader
    shaderRef.current.uTime += delta;
  });

  /**
   * Mouse Events
   */
  // Pointer Moving Over DPad
  const dPadHover = (e) => {
    const dPad = button.dPad;

    mouse.current.position.set(e.point.x, e.point.y, e.point.z);
    let deltaY = dPad.ref.current.position.y - e.point.y;
    let deltaX = dPad.ref.current.position.x - e.point.x;

    dPad.targetYRotation =
      -Math.sign(deltaX) * Math.min(Math.abs(deltaX) * 0.4, 0.1);
    dPad.targetXRotation =
      Math.sign(deltaY) * Math.min(Math.abs(deltaY) * 0.4, 0.1);
  };

  //Pointer moving on to button
  const buttonOn = (buttonName) => {
    button[buttonName].targetZ = button[buttonName].targetZ - 0.1;
  };

  //Pointer moving off button
  const buttonOff = (buttonName) => {
    button[buttonName].targetZ = button[buttonName].targetZ + 0.1;

    button[buttonName].targetYRotation = 0.0;
    button[buttonName].targetXRotation = 0.0;
  };

  return (
    <>
      <group dispose={null}>
        <group
          position={[1.358, 5.107, -1.28]}
          rotation={[Math.PI / 2, 0, -Math.PI]}
          scale={0.306}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text_1.geometry}
            material={plastic_cartridge}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text_2.geometry}
            material={materials.dogeSticker}
          />
        </group>

        <mesh position={[0, 2.8, posZ]}>
          <planeGeometry args={[5, 4]} />
          {setShader === "crtShader" ? (
            <crtMaterial ref={shaderRef} />
          ) : setShader === "mosaic" ? (
            <mosaicMaterial ref={shaderRef} />
          ) : setShader === "newspaper" ? (
            <newsMaterial ref={shaderRef} />
          ) : setShader === "secretClub" ? (
            <secretMaterial ref={shaderRef} />
          ) : setShader === "doge" ? (
            <dogeMaterial ref={shaderRef} />
          ) : (
            <screenMaterial ref={shaderRef} />
          )}
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.border001.geometry}
          position={[0.048, -0.292, -0.025]}
        >
          <meshPhysicalMaterial
            metalness={0.3}
            roughness={0.08}
            envMapIntensity={0.2}
            clearcoat={1}
            transparent={true}
            transmission={0.98}
            opacity={1}
            reflectivity={0.2}
          />
        </mesh>

        <mesh
          ref={button.dPad.ref}
          castShadow
          receiveShadow
          geometry={nodes.d_pad.geometry}
          material={plastic_dPad}
          position={[-1.968, -2.041, 0.985]}
          onPointerMove={dPadHover}
          onPointerEnter={() => buttonOn("dPad")}
          onPointerLeave={() => buttonOff("dPad")}
        />

        <mesh ref={mouse} visible={false}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={[1.5, 1, 4]} toneMapped={false} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.inside_grill.geometry}
          material={plastic_main}
          position={[0.048, -0.292, -0.176]}
          scale={[0.981, 1, 0.936]}
        ></mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.on_switch.geometry}
          material={plastic_dPad}
          position={[-2.372, 6.003, -0.095]}
        />

        <mesh
          castShadow
          geometry={nodes.screenLight.geometry}
          position={[-2.58, 3.305, 0.782]}
          scale={0.106}
        >
          <meshStandardMaterial color={[100, 0.0, 0.1]} toneMapped={false} />
        </mesh>
        <mesh
          ref={button.a.ref}
          castShadow
          receiveShadow
          geometry={nodes.button_a.geometry}
          material={plastic_buttons_ab}
          position={[2.611, -1.661, 0.984]}
          rotation={[Math.PI / 2, 0, 0]}
          onPointerEnter={() => buttonOn("a")}
          onPointerLeave={() => buttonOff("a")}
        />

        <mesh
          ref={button.b.ref}
          castShadow
          receiveShadow
          geometry={nodes.button_b.geometry}
          material={plastic_buttons_ab}
          position={[1.425, -2.216, 1.864]}
          rotation={[Math.PI / 2, 0, 0]}
          onPointerEnter={() => buttonOn("b")}
          onPointerLeave={() => buttonOff("b")}
        />

        <mesh
          ref={button.start.ref}
          castShadow
          receiveShadow
          geometry={nodes.startButton.geometry}
          material={plastic_buttons_selStart}
          position={[-1.299, -3.96, 0.963]}
          rotation={[Math.PI / 2, 0, 0]}
          onPointerEnter={() => buttonOn("start")}
          onPointerLeave={() => buttonOff("start")}
        />

        <mesh
          ref={button.select.ref}
          castShadow
          receiveShadow
          geometry={nodes.selectButton.geometry}
          material={plastic_buttons_selStart}
          position={[-1.299, -3.96, 0.963]}
          rotation={[Math.PI / 2, 0, 0]}
          onPointerEnter={() => buttonOn("select")}
          onPointerLeave={() => buttonOff("select")}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.jack.geometry}
          material={plastic_dPad}
          position={[3.419, 3.821, -0.538]}
          rotation={[0, 0, -Math.PI / 2]}
          scale={[0.615, 0.104, 0.615]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.border.geometry}
          material={plastic_black}
          position={[0.048, -0.292, -0.054]}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.volume_button.geometry}
          material={plastic_dPad}
          position={[-2.658, 2.299, 0.178]}
          rotation={[-Math.PI / 2, 0, -Math.PI]}
          scale={[-1, -0.075, -1]}
        />

        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-b"].geometry}
          material={materials["Gameboy b"]}
          position={[1.801, -3.013, 1.016]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.35, 0.426, 0.35]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-logo"].geometry}
          material={materials["Gameboy logo"]}
          position={[-0.831, 0.023, 1.015]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.525}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-screen"].geometry}
          material={materials["Gameboy Screen Decal"]}
          //0.9
          position={[0.022, 4.825, 0.99]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.165}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-Select"].geometry}
          material={materials["Gameboy select"]}
          position={[-0.825, -4.071, 1.016]}
          rotation={[Math.PI / 2, 0.46, 0]}
          scale={0.144}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-Serial"].geometry}
          material={materials["Gameboy serial"]}
          position={[0.126, 3.03, -1.55]}
          rotation={[Math.PI / 2, -0.011, -3.142]}
          scale={[0.403, 0.31, 0.403]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-Start"].geometry}
          material={materials["Gameboy start"]}
          position={[0.492, -4.067, 1.016]}
          rotation={[Math.PI / 2, 0.51, 0]}
          scale={0.136}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-a"].geometry}
          material={materials.Gameboy_a}
          position={[3.072, -2.487, 1.016]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.35, 0.367, 0.35]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["Decal-tag"].geometry}
          material={materials.Gameboy_tag}
          position={[0.043, 1.547, -1.542]}
          rotation={[Math.PI / 2, 0, Math.PI]}
          scale={1.751}
        />
      </group>
    </>
  );
}

useGLTF.preload("model/gameboy.glb");
