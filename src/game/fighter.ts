import { Sprite, SpriteProps } from "game/sprite";
import { 
    Coords, 
    DirectionFaced, 
    SpriteAnimation, 
} from "utils/types";
import {
    Colour, 
    defaultAttackDamage, 
    defaultHealth,
} from "utils/constants";

export type FighterProps = {
    directionFaced: DirectionFaced;
    healthOffset: Coords;
} & SpriteProps;

export interface Keys {
    left: {
        pressed: boolean;
    },
    right: {
        pressed: boolean;
    },
    jump: {
        pressed: boolean,
    },
}

export class Fighter extends Sprite {
    public readonly width: number = 100;
    
    public readonly height: number = 150;
    
    public readonly healthBarWidth: number = 150;
    
    public readonly healthBarHeight: number = 20;
    
    public readonly remainingHealthIndicatorWidth: number = 30;
    
    public readonly attackBoxWidth: number = 100;
    
    public readonly attackBoxHeight: number = 50;
    
    public readonly gravity: number = 0.6;

    public readonly moveSpeed: number = 5;

    public readonly jumpHeight: number = 15;

    private isAttacking: boolean = false;

    public getIsAttacking = (): boolean => this.isAttacking;

    public setIsAttacking = (isAttacking: boolean): void => {
        this.isAttacking = isAttacking;
    };
    
    private directionFaced: DirectionFaced;

    public getDirectionFaced = (): DirectionFaced => this.directionFaced;

    public setDirectionFaced = (directionFaced: DirectionFaced): void => {
        this.directionFaced = directionFaced;
    };

    private health: number = defaultHealth;

    public getHealth = (): number => this.health;

    public setHealth = (health: number): void => {
        this.health = health;
    };
    
    private healthBarOffset: Coords;

    public getHealthBarOffset = (): Coords => this.healthBarOffset;

    public setHealthBarOffset = (healthOffset: Coords): void => {
        this.healthBarOffset = healthOffset;
    };

    private attackDamage: number = defaultAttackDamage;

    public getDamage = (): number => this.attackDamage;

    public setDamage = (attackDamage: number): void => {
        this.attackDamage = attackDamage;
    };

    private isDead: boolean = false;

    public getIsDead = (): boolean => this.isDead;

    private setIsDead = (isDead: boolean): void => {
        this.isDead = isDead;
    };
    
    constructor({ directionFaced, healthOffset, ...spriteProps }: FighterProps) {
        super(spriteProps);
        this.setDirectionFaced(directionFaced);
        this.setHealthBarOffset(healthOffset);
        this.bindListeners();
        console.log('Fighter loaded');
    };

    public isDying = (): boolean => this.getHealth() <= 0 && !this.getIsDead();

    private switchSpriteState = (state: SpriteAnimation): void => {
        // don't switch if dying
        if (this.getImage().src === this.getSprites().die[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
            if (this.getCurrentFrame() === this.getSprites().die.totalFrames - 1) {
                this.setIsDead(true);
            }
            return;
        }
        
        // don't switch if attack animation is still playing
        if (this.getImage().src === this.getSprites().attack[this.getShouldFlip() ? 'flippedImage' : 'image'].src
            && this.getCurrentFrame() < this.getSprites().attack.totalFrames - 1) {
            return;
        }

        // don't switch if take hit animation is still playing
        if (this.getImage().src === this.getSprites().takeHit[this.getShouldFlip() ? 'flippedImage' : 'image'].src
            && this.getCurrentFrame() < this.getSprites().takeHit.totalFrames - 1) {
            return;
        }

        switch (state) {
            case 'idle':
                if (this.getImage().src !== this.getSprites().idle[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().idle[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().idle.totalFrames);
                    // not resetting current frame here because it's not necessary
                }
                break;
            case 'attack':
                if (this.getImage().src !== this.getSprites().attack[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().attack[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().attack.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'takeHit':
                if (this.getImage().src !== this.getSprites().takeHit[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().takeHit[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().takeHit.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            case 'die':
                if (this.getImage().src !== this.getSprites().die[this.getShouldFlip() ? 'flippedImage' : 'image'].src) {
                    this.setImage(this.getSprites().die[this.getShouldFlip() ? 'flippedImage' : 'image'].src);
                    this.setTotalFrames(this.getSprites().die.totalFrames);
                    this.setCurrentFrame(0);
                }
                break;
            default:
                break;
        }
    };

    public attack(): void {
        this.setIsAttacking(true);
        this.switchSpriteState('attack');
    };

    public takeHit = async (damage: number): Promise<void> => {
        this.switchSpriteState('takeHit');
        
        for (let i = 0; i < damage; i++) {
            await new Promise((resolve) => setTimeout(resolve, 20));
            this.setHealth(this.getHealth() - 1);
        }

        if (this.isDying()) {
            this.switchSpriteState('die');
        }
    };

    private drawHealthBar = (): void => {
        this.getContext().beginPath();
        this.getContext().fillStyle = Colour.Green;
        this.getContext().roundRect(
            this.getPosition().x + this.getHealthBarOffset().x,
            this.getPosition().y + this.getHealthBarOffset().y,
            this.healthBarWidth * (this.getHealth() / 100),
            this.healthBarHeight,
            [0, 2, 2, 0],
        );
        this.getContext().fill();
        this.getContext().closePath();
        
        this.getContext().beginPath();
        this.getContext().strokeStyle = Colour.Grey;
        this.getContext().roundRect(
            this.getPosition().x + this.getHealthBarOffset().x,
            this.getPosition().y + this.getHealthBarOffset().y,
            this.healthBarWidth,
            this.healthBarHeight,
            [0, 2, 2, 0],
        );
        this.getContext().stroke();
        this.getContext().closePath();
    };

    private drawHealthBarInfo = (): void => {
        this.getContext().beginPath();
        this.getContext().fillStyle = Colour.Grey;
        this.getContext().roundRect(
            this.getPosition().x + this.getHealthBarOffset().x - this.remainingHealthIndicatorWidth,
            this.getPosition().y + this.getHealthBarOffset().y,
            this.remainingHealthIndicatorWidth,
            this.healthBarHeight,
            [2, 0, 0, 2],
        );
        this.getContext().fill();
        this.getContext().textAlign = 'center';
        this.getContext().textBaseline = 'middle';
        this.getContext().fillStyle = Colour.White;
        this.getContext().fillText(
            `${this.getHealth()}%`, 
            (this.getPosition().x + this.getHealthBarOffset().x - this.remainingHealthIndicatorWidth) + (this.remainingHealthIndicatorWidth / 2),
            (this.getPosition().y + this.getHealthBarOffset().y + (this.healthBarHeight / 2)),
        );
        this.getContext().closePath();

        this.getContext().beginPath();
        this.getContext().strokeStyle = Colour.Grey;
        this.getContext().roundRect(
            this.getPosition().x + this.getHealthBarOffset().x - this.remainingHealthIndicatorWidth,
            this.getPosition().y + this.getHealthBarOffset().y,
            this.remainingHealthIndicatorWidth,
            this.healthBarHeight,
            [2, 0, 0, 2],
        );
        this.getContext().stroke();
        this.getContext().closePath();
    };

    public update = (): void => {
        this.draw();
        this.drawHealthBar();
        this.drawHealthBarInfo();

        if (!this.getIsDead()) {
            this.animateFrames();
        }
        
        this.switchSpriteState('idle');
    };

    private handleUnload = (_event: Event) => {
        this.destroy();
    };

    private bindListeners = (): void => {
        window.addEventListener('unload', this.handleUnload);
    };

    public destroy = (): void => {
        window.removeEventListener('unload', this.handleUnload);
    };
};
