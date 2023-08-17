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

export type Menu = 'hideMenu' | 'mainMenu' | 'fightMenu';

export type AttackButtons = 'attack-1' | 'attack-2' | 'attack-3' | 'attack-4';

export type AttackButtonMapping = {
    [key in AttackButtons]: {
        selector: HTMLButtonElement;
        listener: (() => void) | undefined;
    };
};
