import { useAtomValue } from "jotai";
import { interactHintAtom, activeProjectAtom } from "../../game/state/gameAtoms";
import styled from "styled-components";

const HintContainer = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  /* ✅ 핵심: 모달(9999)보다 높은 수치를 주어 블러 위로 올림 */
  z-index: 10050; 
  font-family: "KenneyMiniSquare", sans-serif;
  font-size: 14px;
  color: #fff;
  background: rgba(20, 24, 30, 0.85);
  border: 2px solid rgba(255, 255, 255, 0.25);
  padding: 8px 12px;
  border-radius: 8px;
  letter-spacing: 0.2px;
  pointer-events: none; /* 힌트 때문에 마우스 클릭이 막히지 않도록 */
  white-space: nowrap;
`;

export function InteractionHint() {
  const hint = useAtomValue(interactHintAtom);
  const activeProject = useAtomValue(activeProjectAtom);

  const displayHint = activeProject ? "ESC : Close" : hint;

  if (!displayHint) return null;

  return <HintContainer>{displayHint}</HintContainer>;
}