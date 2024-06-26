import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import info from "./info.json";
import pdf from "../public/harrisrydercv.pdf";

function Page() {
  const sections = {
    about: useRef(),
    projects: useRef(),
    experience: useRef(),
  };

  const buttons = {
    about: useRef(),
    projects: useRef(),
    experience: useRef(),
  };

  const copyButton = useRef();

  const [scrolling, setScrolling] = useState(false);
  const [shader, setShader] = useState("default");
  const [mobileMode, setMobileMode] = useState(window.innerWidth < 1000);

  function updateGameBoyDisplay(shader) {
    setShader(shader);
  }

  const handleSectionClick = (sectionId) => {
    setScrolling(true);
    sections[sectionId].current.scrollIntoView({ behavior: "smooth" });

    console.log("SectiionID", sectionId);

    Object.values(buttons).map((element) => {
      element.current.classList.remove("active");
    });

    buttons[sectionId].current.classList.add("active");
  };

  function handleWindowSizeChange() {
    if (window.innerWidth < 1000) {
      if (!mobileMode) setMobileMode(true);
    } else {
      setMobileMode(false);
    }
  }

  useEffect(() => {
    const rightContainer = document.querySelector(".right-content");

    const handleScroll = (e) => {
      const projectsDelta =
        sections["projects"].current.offsetTop - rightContainer.scrollTop;
      const experienceDelta =
        sections["experience"].current.offsetTop - rightContainer.scrollTop;

      const updateButtonState = (
        aboutActive,
        projectsActive,
        experienceActive
      ) => {
        buttons["about"].current.classList.toggle("active", aboutActive);
        buttons["projects"].current.classList.toggle("active", projectsActive);
        buttons["experience"].current.classList.toggle(
          "active",
          experienceActive
        );
      };

      if (rightContainer.scrollTop < 1 && rightContainer.scrollTop > -1) {
        if (buttons["about"].current.classList.contains("active"))
          setScrolling(false);
        if (!scrolling) updateButtonState(true, false, false);
      } else if (projectsDelta < 60 && projectsDelta > -50) {
        if (buttons["projects"].current.classList.contains("active"))
          setScrolling(false);
        if (!scrolling) updateButtonState(false, true, false);
      } else if (experienceDelta < 50) {
        if (buttons["experience"].current.classList.contains("active"))
          setScrolling(false);
        if (!scrolling) updateButtonState(false, false, true);
      }
    };

    if (!mobileMode) {
      rightContainer.addEventListener("scroll", handleScroll);
    }

    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      rightContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [scrolling, mobileMode]);

  useEffect(() => {
    handleWindowSizeChange();

    let glow = document.querySelector("#glow");

    const handleMouseMove = (event) => {
      // mouse position in %
      let mousePosition = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      };

      // account for #glow size offset
      const posX = mousePosition.x - 50;
      const posY = mousePosition.y - 50;

      // Apply styles
      glow.style.left = `${posX}%`;
      glow.style.top = `${posY}%`;
    };

    if (!mobileMode)
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mobileMode]);

  return (
    <>
      <div id="glow"></div>

      <div id="html-content">
        {!mobileMode && (
          <div className="left-content">
            <div className="html">
              <h1>Harris Ryder</h1>
              <h2>Fullstack Developer</h2>
              <div className="nav">
                <p
                  className="nav-about active"
                  onClick={() => handleSectionClick("about")}
                  ref={buttons.about}
                >
                  ABOUT
                </p>
                <p>/</p>
                <p
                  className="nav-projects"
                  onClick={() => handleSectionClick("projects")}
                  ref={buttons.projects}
                >
                  PROJECTS
                </p>
                <p>/</p>
                <p
                  className="nav-experience"
                  onClick={() => handleSectionClick("experience")}
                  ref={buttons.experience}
                >
                  EXPERIENCE
                </p>
              </div>

              <div className="icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  onClick={() =>
                    window.open(
                      "https://github.com/H5Ryder",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/harris-ryder/",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="stroke"
                  onClick={() =>
                    window.open(
                      "https://codepen.io/harrisryder",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <path
                    d="M3.06 41.732L32 60.932l28.94-19.2V22.268L32 3.068l-28.94 19.2zm57.878 0L32 22.268 3.06 41.732m0-19.463L32 41.47l28.94-19.2M32 3.068v19.2m0 19.463v19.2"
                    strokeWidth="5"
                  ></path>
                </svg>

                <svg
                  fill="#000000"
                  height="800px"
                  width="800px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 485 485"
                  onClick={() =>
                    (window.location.href = "mailto:harrisryder321@gmail.com")
                  }
                >
                  <path
                    d="M413.974,71.026C368.171,25.225,307.274,0,242.5,0S116.829,25.225,71.026,71.026C25.225,116.829,0,177.726,0,242.5
	s25.225,125.671,71.026,171.474C116.829,459.775,177.726,485,242.5,485c32.731,0,64.491-6.414,94.397-19.063l-11.688-27.63
	C299.022,449.384,271.194,455,242.5,455C125.327,455,30,359.673,30,242.5S125.327,30,242.5,30S455,125.327,455,242.5
	c0,51.323-31.534,74.699-60.834,74.699c-29.299,0-60.833-23.375-60.833-74.699c0-50.086-40.747-90.833-90.833-90.833
	s-90.833,40.748-90.833,90.833s40.747,90.833,90.833,90.833c29.655,0,56.034-14.286,72.622-36.335
	c4.248,8.577,9.594,16.336,16.04,23.113c16.613,17.468,38.988,27.087,63.004,27.087c24.017,0,46.392-9.62,63.005-27.087
	C475.377,300.97,485,274.132,485,242.5C485,177.726,459.775,116.829,413.974,71.026z M242.5,303.333
	c-33.543,0-60.833-27.29-60.833-60.833s27.29-60.833,60.833-60.833s60.833,27.29,60.833,60.833S276.043,303.333,242.5,303.333z"
                  />
                </svg>
              </div>
            </div>

            <Canvas
              camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [5, 2, 20],
              }}
            >
              <Experience setShader={shader} />
            </Canvas>
          </div>
        )}

        <div className="right-content">
          {mobileMode && (
            <div className="mobile-header">
              <h1>Harris Ryder</h1>
              <h2>Fullstack Developer</h2>

              <div className="icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  onClick={() =>
                    window.open(
                      "https://github.com/H5Ryder",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/harris-ryder/",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="stroke"
                  onClick={() =>
                    window.open(
                      "https://codepen.io/harrisryder",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  <path
                    d="M3.06 41.732L32 60.932l28.94-19.2V22.268L32 3.068l-28.94 19.2zm57.878 0L32 22.268 3.06 41.732m0-19.463L32 41.47l28.94-19.2M32 3.068v19.2m0 19.463v19.2"
                    strokeWidth="5"
                  ></path>
                </svg>

                <svg
                  fill="#000000"
                  height="800px"
                  width="800px"
                  version="1.1"
                  id="Layer_1"
                  viewBox="0 0 485 485"
                  onClick={() =>
                    (window.location.href = "mailto:harrisryder321@gmail.com")
                  }
                >
                  <path
                    d="M413.974,71.026C368.171,25.225,307.274,0,242.5,0S116.829,25.225,71.026,71.026C25.225,116.829,0,177.726,0,242.5
	s25.225,125.671,71.026,171.474C116.829,459.775,177.726,485,242.5,485c32.731,0,64.491-6.414,94.397-19.063l-11.688-27.63
	C299.022,449.384,271.194,455,242.5,455C125.327,455,30,359.673,30,242.5S125.327,30,242.5,30S455,125.327,455,242.5
	c0,51.323-31.534,74.699-60.834,74.699c-29.299,0-60.833-23.375-60.833-74.699c0-50.086-40.747-90.833-90.833-90.833
	s-90.833,40.748-90.833,90.833s40.747,90.833,90.833,90.833c29.655,0,56.034-14.286,72.622-36.335
	c4.248,8.577,9.594,16.336,16.04,23.113c16.613,17.468,38.988,27.087,63.004,27.087c24.017,0,46.392-9.62,63.005-27.087
	C475.377,300.97,485,274.132,485,242.5C485,177.726,459.775,116.829,413.974,71.026z M242.5,303.333
	c-33.543,0-60.833-27.29-60.833-60.833s27.29-60.833,60.833-60.833s60.833,27.29,60.833,60.833S276.043,303.333,242.5,303.333z"
                  />
                </svg>
              </div>
            </div>
          )}

          {mobileMode && <h3 className="sticky-section">About</h3>}

          <div className="about" ref={sections.about}>
            {Object.values(info.about).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {mobileMode && <h3 className="sticky-section">Projects</h3>}

          <div className="projects" ref={sections.projects}>
            {info.projects.map((project, index) => (
              <div
                key={index}
                className="project"
                onMouseEnter={() => updateGameBoyDisplay(project.shader)}
              >
                <img
                  className="project-image"
                  src={`small/${project.img}`}
                  alt="project image"
                />

                <div className="project-info">
                  <h3>
                    <a href={project.href} target="_blank">
                      {project.name}
                      <svg
                        className="link-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </h3>

                  <p>{project.info}</p>

                  <ul className="tags">
                    {project.tags.map((value, index) => {
                      return <li key={index}>{value}</li>;
                    })}

                    {project.token && (
                      <li
                        className="link-tag"
                        key={project.tags.length + 1}
                        onClick={() =>{
                          navigator.clipboard.writeText(project.token)
                          copyButton.current.classList.remove("hide")
                          setTimeout(() => {
                            copyButton.current.classList.add("hide");
                          }, 1000);

                        }}
                      >
                        {"Token"}
                        <svg className="clipboard" fill="#59dcd5" width="800px" height="800px" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title/><path d="M27.2,8.22H23.78V5.42A3.42,3.42,0,0,0,20.36,2H5.42A3.42,3.42,0,0,0,2,5.42V20.36a3.43,3.43,0,0,0,3.42,3.42h2.8V27.2A2.81,2.81,0,0,0,11,30H27.2A2.81,2.81,0,0,0,30,27.2V11A2.81,2.81,0,0,0,27.2,8.22ZM5.42,21.91a1.55,1.55,0,0,1-1.55-1.55V5.42A1.54,1.54,0,0,1,5.42,3.87H20.36a1.55,1.55,0,0,1,1.55,1.55v2.8H11A2.81,2.81,0,0,0,8.22,11V21.91ZM28.13,27.2a.93.93,0,0,1-.93.93H11a.93.93,0,0,1-.93-.93V11a.93.93,0,0,1,.93-.93H27.2a.93.93,0,0,1,.93.93Z"/></svg>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}

            <div className="projects-more">
              <a
                href="https://h5ryder.github.io/old-portfolio/"
                target="_blank"
              >
                View all projects
              </a>
            </div>
          </div>

          {mobileMode && <h3 className="sticky-section">Experience</h3>}

          <div className="experience" ref={sections.experience}>
            {info.experience.map((job, index) => (
              <div key={index} className="job">
                <p className="job-date"> {job.date}</p>

                <div className="job-info">
                  <h3>
                    <a target="_blank">
                      {job.name}
                      <svg
                        className="link-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </h3>

                  <p>{job.info}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="experience-more">
            <a href={pdf} target="blank">
              Download Resume
            </a>
          </div>


          <div className="clipboard-notification hide" ref={copyButton}>
            Saved to Clipboard!
          </div>

        </div>
      </div>
    </>
  );
}

export default Page;
