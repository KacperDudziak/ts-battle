import { GameMap } from "./GameMap";
import { Unit } from "./Unit";
import { Vector2 } from "./Vector2";
import { InputManager } from "./InputManager";
import { CanvasHelper } from "./CanvasHelper";
import { Painter } from "./Painter";
import { Node } from "./Node";
import { PlayerTurn } from "./PlayerTurn";
import { Utils } from "./Utils";
import { Drawable } from "./Drawable";

export class Game
{
    public readonly enemyUnitNumber: number = 3;
    public readonly playerUnitNumber: number = 3;

    private readonly canvas: HTMLCanvasElement;
    private readonly painter: Painter;
    private readonly map: GameMap;
    private readonly inputManager: InputManager;
    private enemyUnitsLeft: number = this.enemyUnitNumber;

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
        const spawnNodes: Node[] = this.GetRandomSpawnNodes(this.playerUnitNumber + this.enemyUnitNumber);
        let leftSide = spawnNodes.slice(0, this.playerUnitNumber);
        let rightSide = spawnNodes.slice(this.playerUnitNumber);
        this.playerUnits = this.SpawnUnits(leftSide, "blue");


        this.aiUnits = this.SpawnUnits(rightSide, "red");
        // this.WinGame();
        this.Start();
    }

    /**Called once when game starts */
    private Start(): void
    {        
        this.NextTurn();
    }

    private GetRandomSpawnNodes(nodeNumber: number): Node[]
    {
        let spawnNodes: Node[] = new Array<Node>(nodeNumber);
        let spawnNodeIds: [number, number][] = new Array<[number, number]>(nodeNumber);
        for (let i = 0; i < nodeNumber; i++)
        {
            let done: boolean = false;
            while (!done)
            {
                let newSpawnId: [number, number] = [this.GetRandomInt(this.map.height - 5), this.GetRandomInt(this.map.width - 10)];
                if (!Utils.IsElementInArray(spawnNodeIds, newSpawnId))
                {
                    done = true;
                    spawnNodeIds.push(newSpawnId);
                    const newSpawnNode = this.map.nodes[newSpawnId[0]][newSpawnId[1]];
                    spawnNodes[i] = newSpawnNode;
                }
            }
        }
        return spawnNodes;
    }

    private GetRandomInt(max: number)
    {
        let rnd: number = Math.random();
        rnd *= (max-1);
        return Math.round(rnd);
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

        this.enemyUnitsLeft--;
        console.log(`Enemy units left: ${this.enemyUnitsLeft}`);
        if (this.enemyUnitsLeft <= 0)
        {
            this.WinGame();
        }
    }

    private WinGame(): void
    {
        console.log("You win!");
        this.painter.RegisterDrawable(new Win(), 1);
    }

}

class Win implements Drawable
{
    Draw(context: CanvasRenderingContext2D): void
    {
        CanvasHelper.DrawText(CanvasHelper.sharedContext, "You Win!", new Vector2(500, 250), 200, "Arial", "blue");
    }
    
}