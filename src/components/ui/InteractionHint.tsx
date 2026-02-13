import { useAtomValue } from "jotai";
import { interactHintAtom, activeProjectAtom } from "../../game/state/stateAtoms";
import styled from "styled-components";

const HintContainer = styled.div`
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  z-index: 10050; 
  font-family: "KenneyMiniSquare", sans-serif;
  font-size: 30px;
  color: #fff;
  background: rgba(20, 24, 30, 0.85);
  border: 2px solid rgba(255, 255, 255, 0.25);
  padding: 8px 12px;
  border-radius: 8px;
  letter-spacing: 0.2px;
  pointer-events: none;
  white-space: nowrap;
`;

export function InteractionHint() {
  const hint = useAtomValue(interactHintAtom);
  const activeProject = useAtomValue(activeProjectAtom);

  const displayHint = activeProject ? "ESC : Close" : hint;

  if (!displayHint) return null;

  return <HintContainer>{displayHint}</HintContainer>;
}