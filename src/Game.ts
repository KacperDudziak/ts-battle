import { GameMap } from "./GameMap";
import { Unit } from "./Unit";
import { Vector2 } from "./Vector2";
import { InputManager } from "./InputManager";
import { CanvasHelper } from "./CanvasHelper";
import { Painter } from "./Painter";
import { Node } from "./Node";
import { PlayerTurn } from "./PlayerTurn";
import { Utils } from "./Utils";

export class Game
{
    private readonly canvas: HTMLCanvasElement;
    private readonly painter: Painter;
    private readonly map: GameMap;
    private readonly inputManager: InputManager;

    /**All units owned by player */
    private readonly playerUnits: Unit[];
    /**All units owned by AI */
    private readonly aiUnits: Unit[];

    constructor()
    {
        this.canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
        CanvasHelper.sharedContext = this.canvas.getContext("2d");
        this.painter = new Painter(2, CanvasHelper.sharedContext);
        this.inputManager = new InputManager(this.canvas);
        this.map = new GameMap(this.painter, this.inputManager);
        this.playerUnits = new Array<Unit>(0);
        this.aiUnits = new Array<Unit>(0);

        // spawn player's units
        const playerSpawnNodes: Node[] = [this.map.nodes[1][1], this.map.nodes[3][3], this.map.nodes[6][1]];
        this.playerUnits = this.SpawnUnits(playerSpawnNodes, "blue");

        const aiSpawnNodes: Node[] = [this.map.nodes[1][18], this.map.nodes[3][16], this.map.nodes[6][18]];
        this.aiUnits = this.SpawnUnits(aiSpawnNodes, "red");

        this.Start();
    }

    /**Called once when game starts */
    private Start(): void
    {
        
        window.requestAnimationFrame(this.Update.bind(this));
        this.NextTurn();
    }

    /**Spawns and returns units with default stats in provided nodes */
    private SpawnUnits(nodes: Node[], color: string): Unit[]
    {
        const spawnedUnits: Unit[] = new Array<Unit>(nodes.length);

        for (let i = 0; i < nodes.length; i++) 
        {
            const newUnit: Unit = new Unit(nodes[i], 50, 25, 0, 80, new Vector2(-10, 10), new Vector2(10, -10), color, 10);
            spawnedUnits[i] = newUnit;
            this.inputManager.RegisterClickable(newUnit);
            this.painter.RegisterDrawable(newUnit, 1);
        }

        return spawnedUnits;
    }

    /**Called every frame */
    private Update(): void
    {
        

        window.requestAnimationFrame(this.Update.bind(this));
    }

    /**Starts next turn */
    private NextTurn(): void
    {
        const turn = new PlayerTurn(this.playerUnits, this.aiUnits, this.AiTurn.bind(this), this.map, this.inputManager, this.DeleteUnit.bind(this));
    }

    /**When called, AI makes it move */
    private AiTurn(): void
    {
        // TO DO: add AI that does something
        this.NextTurn()
    }

    private RemoveDeadUnits(): void
    {
        console.log("Looking for dead units");
        let deadUnits: Unit[] = new Array<Unit>(0);
        this.playerUnits.forEach(unit => { if (unit.currentHp <= 0) deadUnits.push(unit); });
        deadUnits.forEach(unit => (() => this.DeleteUnit(unit)).bind(this));
        deadUnits = new Array<Unit>(0);
        this.aiUnits.forEach(unit => { if (unit.currentHp <= 0) deadUnits.push(unit); });
        deadUnits.forEach(unit => (() => this.DeleteUnit(unit)).bind(this));
    }

    private DeleteUnit(unit: Unit): void
    {
        console.log("Deleting dead unit");
        Utils.TryRemoveFromArray(this.playerUnits, unit);
        Utils.TryRemoveFromArray(this.aiUnits, unit);

        this.inputManager.UnregisterClickable(unit);
        this.painter.UnregisterDrawable(unit);
    }
}