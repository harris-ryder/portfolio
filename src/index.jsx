import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import info from './info.json';
import gameImage from '../public/game.png';
import Page from "./Page.jsx";


const root = ReactDOM.createRoot(document.querySelector("#root"));


root.render(
  <Page/>
);
