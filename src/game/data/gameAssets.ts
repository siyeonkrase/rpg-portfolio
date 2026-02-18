import churchBuilding from "../../assets/image/churchPng.png"
import cinemaSign from "../../assets/image/cinemaSign.png"
import computerSign from "../../assets/image/computerSign.png"
import weddingIcon from "../../assets/image/inventory/ring.png";
import movieIcon from "../../assets/image/inventory/movie.png";
import chromeIcon from "../../assets/image/inventory/com.png";
import cryptoIcon from "../../assets/image/inventory/coin.png";
import bentoIcon from "../../assets/image/inventory/note.png";

import movieModalPng from "../../assets/image/modal/movieModal.png"; 
import comModalPng from "../../assets/image/modal/comModal.png";
import cryptoModalPng from "../../assets/image/modal/bankModal.png";
import weddingModalPng from "../../assets/image/modal/weddingModal.png";
import kanbanModalPng from "../../assets/image/modal/kanbanModal.png";

import weddingShot from "../../assets/image/modal/screenshots/wedding.png";
import movieShot from "../../assets/image/modal/screenshots/flickfacts.png";
import bentoShot from "../../assets/image/modal/screenshots/bento.png";
import chromeShot from "../../assets/image/modal/screenshots/chrome.png";
import cryptoShot from "../../assets/image/modal/screenshots/crypto.png";

import villagerManPng from "../../assets/image/char/MiniVillagerMan.png";

import speakerOn from "../../assets/image/ui/speaker-0.png";
import speakerOff from "../../assets/image/ui/speaker-Crossed.png";
import helpIcon from "../../assets/image/ui/helpIcon.png"

export const GAME_ASSETS = {
  churchBuilding,
  cinemaSign,
  computerSign,
  villagerManPng,
  speakerOn,
  speakerOff,
  helpIcon
} as const;

export const MODAL_ASSETS = {
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
} as const;

export const PROJECT_ICONS: Record<string, string> = {
  wedding: weddingIcon,
  flickfacts: movieIcon,
  chromeapp: chromeIcon,
  crypto: cryptoIcon,
  bento: bentoIcon,
};

export const GAME_ASSET_URLS = Object.values(GAME_ASSETS);
export const MODAL_ASSET_URLS = Object.values(MODAL_ASSETS);

export function preloadImages(urls: readonly string[]) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load: ${src}`));
          img.src = src;
        })
    )
  );
}
