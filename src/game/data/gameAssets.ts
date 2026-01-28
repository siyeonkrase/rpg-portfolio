import churchBuilding from "../../assets/churchPng.png"
import cinemaSign from "../../assets/cinemaSign.png"
import computerSign from "../../assets/computerSign.png"
import weddingIcon from "../../assets/inventory/ring.png";
import movieIcon from "../../assets/inventory/movie.png";
import chromeIcon from "../../assets/inventory/com.png";
import cryptoIcon from "../../assets/inventory/coin.png";
import bentoIcon from "../../assets/inventory/note.png";

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

import villagerManPng from "../../assets/MiniVillagerMan.png";

export const GAME_ASSETS = {
  churchBuilding,
  cinemaSign,
  computerSign,
  weddingIcon,
  movieIcon,
  chromeIcon,
  cryptoIcon,
  bentoIcon,
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
  villagerManPng,
} as const;

export const GAME_ASSET_URLS = Object.values(GAME_ASSETS);

export function preloadImages(urls: readonly string[]) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
}
