import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(63, 94, 251, 0.2); }
  50% { box-shadow: 0 0 20px rgba(63, 94, 251, 0.6); }
`;

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  z-index: 20000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #020202;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Ring = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px dashed #3f5efb; 
  border-radius: 50%;
  animation: ${spin} 2s linear infinite, ${glow} 1.5s infinite ease-in-out;
`;

const Core = styled.div`
  width: 20px;
  height: 20px;
  background: #fff;
  transform: rotate(45deg);
  animation: ${spin} 1s reverse infinite;
`;

const LoadingText = styled.div`
  margin-top: 30px;
  font-family: "KenneyMiniSquare";
  font-size: 20px;
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
`;

export function Loading() {
  return (
    <Wrap>
      <SpinnerContainer>
        <Ring />
        <Core />
      </SpinnerContainer>
      
      <LoadingText>INITIALIZING...</LoadingText>
      
      <div style={{ 
        position: 'absolute', 
        bottom: 40, 
        opacity: 0.3, 
        fontFamily: "KenneyMini", 
        fontSize: 12,
        letterSpacing: '1px'
      }}>
        LOADING ASSETS
      </div>
    </Wrap>
  );
}