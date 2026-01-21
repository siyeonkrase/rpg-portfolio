import ReactDOM from 'react-dom/client';
import App from './App';
import { createGlobalStyle } from 'styled-components';
import KennyMiniSquareTtf from "./assets/fonts/KenneyMiniSquare.ttf";
import KennyMiniTtf from "./assets/fonts/KenneyMini.ttf";
import MedodicaRegular from "./assets/fonts/MedodicaRegular.otf";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'KenneyMiniSquare';
  src: url(${KennyMiniSquareTtf}) format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'KenneyMini';
  src: url(${KennyMiniTtf}) format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'MedodicaRegular';
  src: url(${MedodicaRegular}) format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  caret-color: transparent;
  user-select: none;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
  -ms-overflow-style: none;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  color: black;
  line-height: 1.2;
  margin: 0;
}
a {
  text-decoration:none;
  color:inherit;
}
::-webkit-scrollbar {
  display: none;
}
.box{
  -ms-overflow-style: none;
}
.box::-webkit-scrollbar{
  display:none;
}
h1{
  font-family: 'KenneyMiniSquare', sans-serif;
  letter-spacing: 0.04em;
}
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <GlobalStyle />
      <App />
  </>
);
