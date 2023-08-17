import gsap from "gsap";

import { Base } from "game/base";
import { Fighter, FighterProps } from "game/fighter";
import { Sprite } from "game/sprite";
import { Colour, Direction, defaultCanvasWidth, enemySprites, playerSprites } from "utils/constants";
import { Menu } from "utils/types";

export class Engine extends Base {
    private animationRequestId: number;

    private getAnimationRequestId = (): number => this.animationRequestId;

    private setAnimationRequestId = (animationRequestId: number): void => {
        this.animationRequestId = animationRequestId;
    };

    private background: Sprite;

    public getBackground = (): Sprite => this.background;

    private setBackground = (background: Sprite): void => {
        this.background = background;
    };
    
    private player: Fighter;

    public getPlayer = (): Fighter => this.player;

    private setPlayer = (player: Fighter): void => {
        this.player = player;
    };
    
    private enemy: Fighter;

    public getEnemy = (): Fighter => this.enemy;

    private setEnemy = (enemy: Fighter): void => {
        this.enemy = enemy;
    };

    constructor() {
        super();
        this.setCanvasSize();
        this.bindListeners();
        console.log('Engine loaded');
    };

    private draw = (): void => {
        // const background: Sprite = new Sprite({
        //     position: { x: 0, y: 0 },
        //     imageSrc: 'assets/img/background.png',
        // });
        // this.setBackground(background);
        
        const player: Fighter = this.createFighter({
            position: { x: 20, y: 200 },
            directionFaced: Direction.Right,
            healthOffset: { x: 140, y: 50 },
            sprites: playerSprites,
            scale: 2.0,
        });
        this.setPlayer(player);
        
        const enemy: Fighter = this.createFighter({
            position: { x: 500, y: 0 },
            directionFaced: Direction.Left,
            healthOffset: { x: 190, y: 100 },
            sprites: enemySprites,
            scale: 3.5,
            shouldFlip: true,
        });
        this.setEnemy(enemy);
    };

    private setCanvasSize = (): void => {
        // const width: number = window.innerWidth;
        const height: number = window.innerHeight;
        const width: number = defaultCanvasWidth;
        // const height: number = defaultCanvasHeight;
        
        this.canvas.width = width;
        this.canvas.height = height;

        this.getContext().clearRect(0, 0, width, height);
        this.getContext().fillRect(0, 0, width, height);
        this.draw();
    }

    private createFighter = (props: FighterProps): Fighter => {
        const fighter = new Fighter(props);
        fighter.draw();
        return fighter;
    };

    private stopAnimation = (): void => {
        if (this.getAnimationRequestId()) {
            cancelAnimationFrame(this.getAnimationRequestId());
        }
    };

    private checkGameOver = (): void => {
        let gameOver: boolean = false;
        
        if (this.getPlayer().isDying()) {
            this.gameOverTitle.innerHTML = 'Game over, you lose!';
            this.getPlayer().destroy();
            setTimeout(() => {
                this.endGame();
            }, 3000);
        } else if (this.getEnemy().isDying()) {
            this.gameOverTitle.innerHTML = 'Game over, you win!';
            this.getEnemy().destroy();
            setTimeout(() => {
                this.endGame();
            }, 3000);
        }

        if (gameOver) {
            this.endGame();
        }
    };

    private endGame = (): void => {
        this.stopAnimation();
        
        this.getPlayer().destroy();
        this.getEnemy().destroy();

        // ensure closed before re-opening otherwise error will be thrown
        this.gameOverDialog.close();
        this.gameOverDialog.showModal();
    };

    public run = (): void => {
        const animationRequestId = requestAnimationFrame(this.run);
        this.setAnimationRequestId(animationRequestId);

        this.getContext().fillStyle = Colour.White;
        this.getContext().fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // this.getBackground().update();
        // overlay so that the background and shop are less in focus
        this.getContext().fillStyle = Colour.Overlay;
        this.getContext().fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.getPlayer().update();
        this.getEnemy().update();

        this.checkGameOver();
    };

    private toggleMenu = (menu: Menu): void => {
        switch (menu) {
            case 'hideMenu':
                this.mainMenu.dataset.mainMenu = "false";
                this.fightMenu.dataset.fightMenu = "false";
                break;
            case 'mainMenu':
                this.mainMenu.dataset.mainMenu = "true";
                this.fightMenu.dataset.fightMenu = "false";
                break;
            case 'fightMenu':
                this.mainMenu.dataset.mainMenu = "false";
                this.fightMenu.dataset.fightMenu = "true";
                break;
            default:
                break;
        };
    };

    private handleGameOverBtnClick = (): void => {
        this.destroy();
        window.location.reload();
    };

    private handleFightBtnClick = (): void => {
        this.toggleMenu('fightMenu');
    };

    private handleAttackBtnClick = async (): Promise<void> => {
        this.toggleMenu('hideMenu');
        this.getPlayer().attack();
        await this.getEnemy().takeHit(this.getPlayer().getDamage());
        this.toggleMenu('mainMenu');
    };

    private handleUnload = (_event: Event) => {
        this.destroy();
    };

    private bindListeners = (): void => {
        this.gameOverBtn.addEventListener('click', this.handleGameOverBtnClick);
        this.fightBtn.addEventListener('click', this.handleFightBtnClick);
        this.attackBtns['attack-1'].selector.addEventListener('click', this.handleAttackBtnClick);
        
        window.addEventListener('resize', this.setCanvasSize);
        window.addEventListener('unload', this.handleUnload);
    };

    private destroy = (): void => {
        this.gameOverBtn.removeEventListener('click', this.handleGameOverBtnClick);
        this.fightBtn.removeEventListener('click', this.handleFightBtnClick);
        this.attackBtns['attack-1'].selector.removeEventListener('click', this.handleAttackBtnClick);
        
        window.removeEventListener('resize', this.setCanvasSize);
        window.removeEventListener('unload', this.handleUnload);
    };
};
