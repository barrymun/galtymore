import { Direction } from "utils/constants";

export interface Coords {
    x: number;
    y: number;
};

export interface AttackBox {
    position: Coords;
};

export interface AttackBoxDimensions {
    offset: Coords;
    width: number;
    height: number;
}

export type DirectionFaced = Direction.Left | Direction.Right;

export type SpriteAnimation = 'idle' | 'attack' | 'takeHit' | 'die';

export type Sprites = {
    [key in SpriteAnimation]: {
        imageSrc: string;
        flippedImageSrc: string;
        totalFrames: number;
    };
};
