import { Sprites } from "utils/types";

export const defaultCanvasWidth: number = 1024;

export const defaultCanvasHeight: number = 576;

export enum Colour {
  Red = "red",
  Green = "green",
  Blue = "blue",
  Black = "black",
  White = "white",
  Grey = "grey",
  Overlay = "rgba(255, 255, 255, 0.15)",
}

export enum Direction {
  Left = "left",
  Right = "right",
}

export const playerSprites: Sprites = {
  idle: {
    imageSrc: "assets/img/player/idle.png",
    flippedImageSrc: "assets/img/player/idle-flipped.png",
    totalFrames: 6,
  },
  attack: {
    imageSrc: "assets/img/player/attack-1.png",
    flippedImageSrc: "assets/img/player/attack-1-flipped.png",
    totalFrames: 8,
  },
  takeHit: {
    imageSrc: "assets/img/player/take-hit.png",
    flippedImageSrc: "assets/img/player/take-hit-flipped.png",
    totalFrames: 4,
  },
  die: {
    imageSrc: "assets/img/player/death.png",
    flippedImageSrc: "assets/img/player/death-flipped.png",
    totalFrames: 7,
  },
};

export const enemySprites: Sprites = {
  idle: {
    imageSrc: "assets/img/enemy/idle.png",
    flippedImageSrc: "assets/img/enemy/idle-flipped.png",
    totalFrames: 8,
  },
  attack: {
    imageSrc: "assets/img/enemy/attack-1.png",
    flippedImageSrc: "assets/img/enemy/attack-1-flipped.png",
    totalFrames: 8,
  },
  takeHit: {
    imageSrc: "assets/img/enemy/take-hit.png",
    flippedImageSrc: "assets/img/enemy/take-hit-flipped.png",
    totalFrames: 4,
  },
  die: {
    imageSrc: "assets/img/enemy/death.png",
    flippedImageSrc: "assets/img/enemy/death-flipped.png",
    totalFrames: 5,
  },
};

export const defaultHealth: number = 100;

export const defaultAttackDamage: number = 20;
// export const defaultAttackDamage: number = 100;
