import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { activeProjectAtom } from "../../game/state/gameAtoms";
import { closeProjectAtom } from "../../game/state/inventoryAtoms";
import { GAME_ASSET_URLS } from "../../game/data/gameAssets";
import styled from "styled-components";

import movieModalPng from "../../assets/modal/movieModal.png"; 
import comModalPng from "../../assets/modal/comModal.png";
import cryptoModalPng from "../../assets/modal/bankModal.png";
import weddingModalPng from "../../assets/modal/weddingModal.png";
import kanbanModalPng from "../../assets/modal/kanbanModal.png";

import weddingShot from "../../assets/screenshots/wedding.png";
import movieShot from "../../assets/screenshots/flickfacts.png";
import bentoShot from "../../assets/screenshots/bento.png";
import chromeShot from "../../assets/screenshots/chrome.png";
import cryptoShot from "../../assets/screenshots/crypto.png";

type ThemeKey = "movie" | "computer" | "crypto" | "wedding" | "kanban";

function preloadImages(urls: string[]) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          (img as any).decoding = "async";
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
}

const ScrollableText = styled.div<{ themeData: ModalTheme }>`
  flex: 1;
  margin-top: 20px;
  padding-right: 15px;
  overflow-y: scroll; 
  color: ${props => props.themeData.text};
  line-height: 1.6;
  font-size: 15px;

  &::-webkit-scrollbar {
    width: 10px;
    display: block !important;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1); 
    border-radius: 4px;
    box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2);
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.themeData.button}; 
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 2px rgba(0,0,0,0.3);
  }

  &::-webkit-scrollbar-thumb:hover {
    filter: brightness(1.1);
  }
`;

const THEMES = {
  movie: {
    bg: movieModalPng,
    width: "800px",
    height: "650px",
    padding: "135px 80px 20px",
    primary: "#00ffff",
    text: "#eee",
    button: "#E50914",
    titleStyle: {
      top: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "KenneyMiniSquare",
      fontSize: "28px",
      textShadow: "0 0 8px #00ff41",
    },
    closeStyle: {
      top: "17px",
      right: "25px",
      fontFamily: "KenneyMiniSquare",
      fontSize: "35px",
      color: "#00ffff",
      textShadow: "0 0 5px #00ffff, 0 0 10px #00ffff",
      background: "transparent",
      border: "none"
    }
  },
  computer: {
    bg: comModalPng,
    width: "800px",
    height: "650px",
    padding: "90px 50px 30px",
    primary: "#222",
    text: "#333",
    button: "#4A90E2",
    titleStyle: {
      top: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "KenneyMiniSquare",
      fontSize: "28px",
    },
    closeStyle: {
      top: "27px",
      right: "40px",
      fontFamily: "KenneyMiniSquare",
      fontSize: "20px",
      color: "#000",
      background: "#c0c0c0", 
      border: "2px solid",
      borderColor: "#ffffff #808080 #808080 #ffffff",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      lineHeight: "1",
    }
  },
  crypto: {
    bg: cryptoModalPng,
    width: "800px",
    height: "650px",
    padding: "120px 60px 30px",
    primary: "#00ff41",
    text: "#eee",
    button: "#008f11",
    titleStyle: {
      top: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "KenneyMiniSquare",
      fontSize: "28px",
      textShadow: "0 0 8px #00ff41",
    },
    closeStyle: {
      top: "17px",
      right: "25px",
      fontFamily: "KenneyMiniSquare",
      fontSize: "35px",
      color: "#00ff41",
      textShadow: "0 0 5px #00ff41",
      background: "transparent",
      border: "none"
    }
  },
  wedding: {
    bg: weddingModalPng,
    width: "800px",
    height: "650px",
    padding: "130px 60px 40px", 
    primary: "#D9544D",
    text: "#5D4037",
    button: "#A67C52",
    titleStyle: {
      top: "50px",
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "KenneyMiniSquare",
      fontSize: "26px",
      textShadow: "1px 1px 0px #fff"
    },
    closeStyle: {
      top: "25px",
      right: "26px",
      fontFamily: "KenneyMiniSquare",
      fontSize: "22px",
      color: "#d9a38b",
      background: "transparent",
      border: "none",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      textShadow: "1px 1px 0px #fff",
      transition: "transform 0.2s",
    }
  },
  kanban: {
    bg: kanbanModalPng, 
    width: "800px",
    height: "650px",
    padding: "130px 60px 40px",
    primary: "#555",  
    text: "#333",
    button: "#FFB7B7",
    titleStyle: {
      top: "40px",
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: "KenneyMiniSquare",
      fontSize: "26px",
      textShadow: "1px 1px 0px rgba(0,0,0,0.1)",
    },
    closeStyle: {
      top: "40px",
      right: "63px",
      fontFamily: "KenneyMiniSquare",
      fontSize: "16px",
      color: "#fff",
      background: "transparent",
      border: "none",
      borderRadius: "50%",
      width: "26px",
      height: "26px",
      boxShadow: "1px 2px 0px rgba(0,0,0,0.2)",
    }
  }
} as const;

type Project = {
  title: string;
  blurb: string;
  tech: readonly string[];
  demoUrl: string;
  repoUrl: string;
  posterUrl?: string;
  theme: ThemeKey;
};

const PROJECTS: Record<string, Project> = {
  flickfacts: {
    title: "FlickFacts",
    blurb:
      "FlickFacts is a movie discovery web application that helps users explore films by genre and ratings while previewing trailers directly on the homepage. It provides a clean, intuitive browsing experience for users who want quick insights into movies before watching. Designed and developed the entire frontend using React, focusing on intuitive navigation and clean UI. Implemented genre-based filtering, rating-based sorting, and embedded YouTube trailer playback. Learned how to structure reusable React components and integrate external APIs for dynamic content.",
    tech: ["React.js", "JavaScript", "Node.js", "CSS", "HTML", "YouTube Embed API", "TMDB API"],
    demoUrl: "https://siyeonkrase.github.io/movie-web-service/",
    repoUrl: "https://github.com/yourname/flickfacts",
    posterUrl: movieShot,
    theme: "movie",
  },
  wedding: {
    title: "Wedding Invitation Website",
    blurb:
      "A real-world wedding invitation website designed for a bilingual audience. It helps guests easily access event details, navigate content in their preferred language, and submit RSVPs through a simple, mobile-friendly experience. Customized and extended an open-source wedding invitation template to support bilingual users. Implemented automatic language detection and locale-aware UI components, integrated a Google Forms–based RSVP flow, and optimized the layout for mobile-first usage by non-technical users.",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Web Design", "Google Maps Embed API"],
    demoUrl: "https://siyeonkrase.github.io/weddinginvitation/",
    repoUrl: "https://github.com/yourname/wedding",
    posterUrl: weddingShot,
    theme: "wedding",
  },
  crypto: {
    title: "Crypto Tracker",
    blurb:
      "A real-time cryptocurrency tracking web application that helps users monitor market trends, compare coin rankings, and analyze price movements through clear, interactive visualizations on both desktop and mobile. Designed and developed a real-time data dashboard using React and TypeScript. Implemented dark/light mode, interactive price charts, and API-driven coin rankings. Focused on performance, reusable component architecture, and efficient state management for a smooth user experience.",
    tech: ["React.js", "TypeScript", "Styled-Components", "CSS", "HTML"],
    demoUrl: "https://siyeonkrase.github.io/crypto-tracker/",
    repoUrl: "https://github.com/yourname/crypto",
    posterUrl: cryptoShot,
    theme: "crypto",
  },
  bento: {
    title: "Bento Board",
    blurb:
      "Bento Board is a task and workflow management web application that helps users organize boards and tasks through an intuitive, drag-and-drop interface. It focuses on clarity, flexibility, and a smooth user experience across devices. Designed and developed an interactive task management application using React and TypeScript. Implemented board and task CRUD, customizable UI themes, and drag-and-drop interactions. Focused on modular component architecture, type safety, and responsive design.",
    tech: ["React.js", "TypeScript", "styled-components", "CSS", "HTML"],
    demoUrl: "https://siyeonkrase.github.io/kanban-board/",
    repoUrl: "https://example.com",
    posterUrl: bentoShot,
    theme: "kanban",
  },

  chromeapp: {
    title: "Chrome Start Page Dashboard",
    blurb:
      "A personalized start-page web application designed for Chrome’s new-tab experience. It helps users begin their day with essential information such as time, weather, location, and motivational content in a clean, distraction-free layout. Designed and developed a personalized dashboard using React. Implemented real-time updates, persistent user data via local storage, dynamic backgrounds, and API-based weather integration. Focused on building a clean, responsive layout optimized for daily use.",
    tech: ["React.js", "JavaScript", "HTML", "CSS", "OpenWeather API", "Local Storage"],
    demoUrl: "https://siyeonkrase.github.io/ChromeApp/",
    repoUrl: "https://example.com",
    posterUrl: chromeShot,
    theme: "computer",
  },

} as const;


interface ModalTheme {
  bg: string;
  width: string;
  height: string;
  padding: string;
  primary: string;
  text: string;
  button: string;
  titleStyle: {
    top: string,
    left: string,
    transform: string,
    fontFamily: string,
    fontSize: string,
    textShadow?: string,
  },
  closeStyle: {
    top: string;
    right: string;
    fontFamily: string;
    fontSize: string;
    color: string;
    background: string;
    border: string;
    borderColor?: string;
    textShadow?: string;
    width?: string;
    height?: string;
    paddingBottom?: string;
  };
}

type ProjectKey = keyof typeof PROJECTS;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BlurLayer = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: none;
`;

const ModalContent = styled.div<{ themeData: ModalTheme }>`
  position: relative;
  z-index: 1;
  background-image: url(${p => p.themeData.bg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: ${p => p.themeData.width};
  height: ${p => p.themeData.height};
  padding: ${p => p.themeData.padding};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  image-rendering: pixelated;
`;

const CloseButton = styled.button<{ themeData: ModalTheme }>`
  position: absolute;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;

  top: ${props => props.themeData.closeStyle.top};
  right: ${props => props.themeData.closeStyle.right};
  font-family: ${props => props.themeData.closeStyle.fontFamily};
  font-size: ${props => props.themeData.closeStyle.fontSize};
  color: ${props => props.themeData.closeStyle.color};
  background: ${props => props.themeData.closeStyle.background};
  border: ${props => props.themeData.closeStyle.border};
  border-color: ${props => props.themeData.closeStyle.borderColor || 'none'};
  text-shadow: ${props => props.themeData.closeStyle.textShadow || 'none'};
  width: ${props => props.themeData.closeStyle.width || 'auto'};
  height: ${props => props.themeData.closeStyle.height || 'auto'};
  padding-bottom: ${props => props.themeData.closeStyle.paddingBottom || '0'};

  &:hover {
    filter: brightness(1.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    ${props => props.themeData.closeStyle.background !== 'transparent' && `
      border-color: #808080 #ffffff #ffffff #808080;
      padding-top: 2px;
      padding-left: 2px;
    `}
  }
`;

const ModalTitle = styled.div<{ themeData: ModalTheme }>`
  position: absolute;
  top: ${props => props.themeData.titleStyle.top};
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  font-family: ${props => props.themeData.titleStyle.fontFamily};
  font-size: ${props => props.themeData.titleStyle.fontSize};
  color: ${props => props.themeData.primary};
  text-shadow: ${props => props.themeData.titleStyle.textShadow || "none"};
  z-index: 10;
`;

export function ProjectModal() {
  const [activeProject] = useAtom(activeProjectAtom);
  const closeProject = useSetAtom(closeProjectAtom);

  const project = activeProject ? PROJECTS[activeProject as ProjectKey] : null;
  const currentTheme = project ? THEMES[project.theme] : THEMES.computer;

  useEffect(() => {
    const urls = [
      movieModalPng,
      comModalPng,
      cryptoModalPng,
      weddingModalPng,
      kanbanModalPng,
      weddingShot,
      movieShot,
      bentoShot,
      chromeShot,
      cryptoShot,
    ];

    preloadImages(urls).then(() => {
      // console.log("[preload][modal] done", urls.length);
    });
  }, []);

  useEffect(() => {
    if (!activeProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject, closeProject]);

  if (!activeProject || !project) return null;

  return (
    <Overlay onClick={() => closeProject()}>
      <BlurLayer />
      <ModalContent themeData={currentTheme} onClick={(e) => e.stopPropagation()}>

        <ModalTitle themeData={currentTheme}>
          {project.title.toUpperCase()}
        </ModalTitle>

        <CloseButton themeData={currentTheme} onClick={() => closeProject()}>
          ×
        </CloseButton>

        <div style={{ 
          flex: "0 0 auto", 
          width: "85%", 
          aspectRatio: "16/9", 
          backgroundColor: "#000",
          border: "2px solid #333",
          margin: "0 auto",
        }}>
          {project.posterUrl && (
            <img src={project.posterUrl} alt="shot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>

        <ScrollableText themeData={currentTheme}>
          <p style={{ lineHeight: "1.5", margin: 0, fontFamily: "MedodicaRegular", fontSize: "20px" }}>
            {project.blurb}
          </p>

          <div style={{ height: 8 }} />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  fontFamily: "KenneyMini",
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "1px solid rgba(60,45,36,0.35)",
                  background: "rgba(255,255,255,0.55)",
                  color: "#3b2f2a",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 0 rgba(0,0,0,0.06)",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </ScrollableText>

        <div style={{ marginTop: "auto", padding: "10px 0", textAlign: "center" }}>
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 30px",
              backgroundColor: currentTheme.button,
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
              borderRadius: "4px",
              marginTop: "5px",
            }}
          >
            <h1>LAUNCH</h1>
          </a>
        </div>
      </ModalContent>
    </Overlay>
  );
}