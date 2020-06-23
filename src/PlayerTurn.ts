import { Unit } from "./Unit";
import { GameMap } from "./GameMap";
import { InputManager } from "./InputManager";
import { Vector2 } from "./Vector2";
import { Clickable } from "./Clickable";
import { Node } from "./Node";
import { Utils } from "./Utils";

type TurnFinishedHandler = { (): void };

export class PlayerTurn
{
    /**All units owned by player */
    private readonly playerUnits: Unit[];
    /**All units owned by AI */
    private readonly enemyUnits: Unit[];
    /**Called when turn is finished */
    private readonly onTurnFinish: TurnFinishedHandler;
    /**Map on which turn takes place */
    private readonly gameMap: GameMap;
    /**InputManager detecting clicks on nodes and units */
    private readonly inputManager: InputManager;
    /**Called when unit dies */
    private readonly deleteUnit: { (unit: Unit): void; };

    /**Current stage of this turn */
    private turnStage: TurnStage;
    /**A unit selected by the player */
    private selectedPlayerUnit: Unit;

    constructor(playerUnits: Unit[], enemyUnits: Unit[], onTurnFinish: TurnFinishedHandler, gameMap: GameMap, inputManager: InputManager, deleteUnit: { (unit: Unit): void; })
    {
        this.playerUnits = playerUnits;
        this.enemyUnits = enemyUnits;
        this.onTurnFinish = onTurnFinish;
        this.gameMap = gameMap;
        this.inputManager = inputManager;
        this.deleteUnit = deleteUnit;

        this.inputManager.AddOnClickAnyListener(this.OnClickAny, this);
        this.StartPlayerUnitSelection();
    }

    private OnClickAny(event: MouseEvent, clickPosition: Vector2, clickable: Clickable): void
    {
        console.log("something clicked");
        switch (this.turnStage) 
        {
            case TurnStage.select:
                if (clickable instanceof Unit) this.HandlePlayerUnitSelection(clickable);
                break;
            case TurnStage.move:
                if (clickable instanceof Node) this.HandlePlayerUnitMove(clickable);
                else if (clickable instanceof Unit) this.HandlePlayerUnitAttack(clickable);
                break;
            case TurnStage.attack:
                if (clickable instanceof Unit) this.HandlePlayerUnitAttack(clickable);
                break;
            default:
                throw Error("Unexpected turn stage");
                break;
        }
    }

    private StartPlayerUnitSelection(): void
    {
        let anyUnitsLeftToMove = false;

        this.playerUnits.forEach(unit => anyUnitsLeftToMove = unit.movedThisTurn ? anyUnitsLeftToMove : true);

        if (this.selectedPlayerUnit != null) this.selectedPlayerUnit.color = this.selectedPlayerUnit.defaultColor;
    
        if (anyUnitsLeftToMove)
        {
            this.selectedPlayerUnit = null;
            this.turnStage = TurnStage.select;
            this.enemyUnits.forEach(unit => unit.ignoreClicks = true);
            this.gameMap.nodes.forEach(nodes => nodes.forEach(node => node.ignoreClicks = true));
            this.playerUnits.forEach(unit => unit.ignoreClicks = unit.movedThisTurn);
        }
        else
        {
            this.EndThisTurn();
        }
    }

    private HandlePlayerUnitSelection(unit: Unit)
    {
        if (!unit.movedThisTurn && Utils.IsElementInArray(this.playerUnits, unit))
        {
            this.selectedPlayerUnit = unit;
            this.selectedPlayerUnit.color = "#9999FF";
            this.StartPlayerUnitMove();
        }
    }

    private StartPlayerUnitMove(): void
    {
        this.turnStage = TurnStage.move;
        this.gameMap.nodes.forEach(nodes => nodes.forEach(node => node.ignoreClicks = false));
        this.enemyUnits.forEach(unit => { unit.ignoreClicks = true; unit.currentNode.ignoreClicks = true; });
        this.playerUnits.forEach(unit => { unit.ignoreClicks = true; unit.currentNode.ignoreClicks = true; });
    }

    private HandlePlayerUnitMove(node: Node)
    {
        let path: Node[] = this.gameMap.FindPath(this.selectedPlayerUnit.currentNode, node);
        if (path.length <= this.selectedPlayerUnit.speed)
        {
            console.log("moving unit")
            // TO DO: animate unit's movement
            // maybe just add some handler with counter and let it change some flag to ignore all input in this.OnClickAny until it's finished
            this.selectedPlayerUnit.currentNode = path[0];
            this.selectedPlayerUnit.movedThisTurn = true;
            // requestAnimationFrame to avoid detecting a click on this unit after it's moved
            window.requestAnimationFrame((() => this.StartPlayerUnitAttack(this.selectedPlayerUnit)).bind(this));
        }
        else
        {
            console.log("can't move unit that far");    
        }
    }

    private StartPlayerUnitAttack(playerUnit: Unit)
    {
        this.turnStage = TurnStage.attack;
        this.enemyUnits.forEach(unit => unit.ignoreClicks = false);
        this.gameMap.nodes.forEach(nodes => nodes.forEach(node => node.ignoreClicks = true));
        this.playerUnits.forEach(unit => unit.ignoreClicks = false);
    }

    private HandlePlayerUnitAttack(targetedUnit: Unit)
    {
        // selecting current unit means skipping the attack
        if (targetedUnit === this.selectedPlayerUnit)
        {
            console.log("unit skipped attack");
            this.StartPlayerUnitSelection();
        }
        else if (Utils.IsElementInArray(this.enemyUnits, targetedUnit))
        {
            if (Vector2.Distance(targetedUnit.currentNode.position, this.selectedPlayerUnit.currentNode.position) <= this.selectedPlayerUnit.currentAttackRange)
            {
                console.log("attacking unit");
                targetedUnit.TakeHit(this.selectedPlayerUnit.currentDmg);
                if (targetedUnit.currentHp <= 0) this.deleteUnit(targetedUnit);
                this.StartPlayerUnitSelection();
            }
            else
            {
                console.log("unit is to far to be attacked");    
            }
        }
        else
        {
            console.log("Can't attack friendly unit");
        }
    }

    private EndThisTurn(): void
    {
        this.enemyUnits.forEach(unit => unit.ignoreClicks = false);
        this.gameMap.nodes.forEach(nodes => nodes.forEach(node => node.ignoreClicks = false));
        this.playerUnits.forEach(unit => { unit.ignoreClicks = false; unit.movedThisTurn = false;});

        this.inputManager.RemoveOnClickAnyListener(this);
        this.onTurnFinish();
    }
}

enum TurnStage
{
    select,
    move,
    attack
}