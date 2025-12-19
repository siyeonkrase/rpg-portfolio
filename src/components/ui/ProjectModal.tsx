import { useAtom } from "jotai";
import { activeProjectAtom } from "../../game/state/gameAtoms";

const PROJECTS: Record<
  string,
  { title: string; description: string; tech: string[]; link?: string }
> = {
  flickfacts: {
    title: "FlickFacts",
    description: "Movie info / discovery web app demo.",
    tech: ["React", "TypeScript", "API"],
  },
  chromeapp: {
    title: "Chrome Extension",
    description: "A small productivity-focused Chrome extension.",
    tech: ["JavaScript", "Chrome API"],
  },
  wedding: {
    title: "Wedding Landing Page",
    description: "Simple wedding invite / info site.",
    tech: ["React", "Styled-components"],
  },
  crypto: {
    title: "Crypto Dashboard",
    description: "Crypto price dashboard with charts.",
    tech: ["React", "TypeScript"],
  },
  bento: {
    title: "Bento-style Link Hub",
    description: "Personal bento-style links / socials page.",
    tech: ["React", "CSS"],
  },
  rpg: {
    title: "RPG Portfolio Demo",
    description: "This very RPG-style portfolio project.",
    tech: ["React", "Pixi.js", "Jotai"],
  },
};

export function ProjectModal() {
  const [activeProject, setActiveProject] = useAtom(activeProjectAtom);

  if (!activeProject) return null;

  const project = PROJECTS[activeProject];
  if (!project) return null;

  const handleClose = () => setActiveProject(null);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 360,
          padding: 16,
          backgroundColor: "#1c1c1c",
          color: "#f7f7f7",
          border: "2px solid #f4e04d",
          fontFamily: "monospace",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{project.title}</h2>
        <p>{project.description}</p>
        <p>
          <b>Tech:</b> {project.tech.join(", ")}
        </p>
        {project.link && (
          <p>
            <a href={project.link} target="_blank" rel="noreferrer">
              View more
            </a>
          </p>
        )}
        <button onClick={handleClose} style={{ marginTop: 8 }}>
          Close
        </button>
      </div>
    </div>
  );
}
