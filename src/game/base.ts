import { AttackButtonMapping } from "utils/types";

export abstract class Base {
    public readonly canvas = document.getElementById('c')! as HTMLCanvasElement;

    public readonly mainMenu = document.getElementById('main-menu')! as HTMLDivElement;

    public readonly fightBtn = document.getElementById('fight')! as HTMLButtonElement;
    
    public readonly fightMenu = document.getElementById('fight-menu')! as HTMLDivElement;
    
    public readonly attackBtns: AttackButtonMapping = {
        'attack-1': {
            selector: document.getElementById('attack-1')! as HTMLButtonElement,
            listener: undefined,
        },
        'attack-2': {
            selector: document.getElementById('attack-2')! as HTMLButtonElement,
            listener: undefined,
        },
        'attack-3': {
            selector: document.getElementById('attack-3')! as HTMLButtonElement,
            listener: undefined,
        },
        'attack-4': {
            selector: document.getElementById('attack-4')! as HTMLButtonElement,
            listener: undefined,
        },
    };
    
    public readonly gameOverDialog = document.getElementById('game-over-dialog')! as HTMLDialogElement;
    
    public readonly gameOverTitle = document.getElementById('game-over-title')! as HTMLDivElement;
    
    public readonly gameOverBtn = document.getElementById('game-over-btn')! as HTMLButtonElement;
    
    private context: CanvasRenderingContext2D;
    
    public getContext = (): CanvasRenderingContext2D => this.context;

    protected setContext = (context: CanvasRenderingContext2D): void => {
        this.context = context;
    };

    constructor() {
        this.setContext(this.canvas.getContext('2d')!);
    };
};
