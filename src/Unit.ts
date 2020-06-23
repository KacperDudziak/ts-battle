import { Clickable } from "./Clickable";
import { Vector2 } from "./Vector2";
import { Node } from "./Node";
import { CanvasHelper } from "./CanvasHelper";
import { Drawable } from "./Drawable";

export class Unit implements Clickable, Drawable
{
    /**Node on which unit is located */
    public currentNode: Node;

    /**Set to true at the beginning of each turn and set to false when unit moves */
    public canMove: boolean = true;

    public color: string;
    public readonly defaultColor: string;

    //#region statistics

    /**Number of health points unit currently has */
    public currentHp: number;
    /**Amount of damage this uint deals */
    public currentDmg: number;
    /**Unit's defense points */
    public currentDefense: number
    /**Attack range in distance units, not nodes */
    public currentAttackRange: number;
    /**How far can this unit move in one turn */
    public speed: number;

    /**Number of health points unit has when it's spawned */
    public readonly maxHp: number;
    public readonly defaultDmg: number;
    public readonly defaultDefense: number;
    public readonly defaultAttackRange: number;

    //#endregion

    constructor(node: Node, hp: number, dmg: number, def: number, attackRange: number, lowerLeftCorner: Vector2, upperRightCorner: Vector2, color: string, speed: number)
    {
        this.currentNode = node;
        this.maxHp = hp;
        this.currentHp = hp;
        this.defaultDmg = dmg;
        this.currentDmg = dmg;
        this.defaultDefense = def;
        this.currentDefense = def;
        this.defaultAttackRange = attackRange;
        this.currentAttackRange = attackRange;
        this.lowerLeftCorner = lowerLeftCorner;
        this.upperRightCorner = upperRightCorner;
        this.color = color;
        this.defaultColor = color;
        this.speed = speed;
    }

    //#region Clickable

    /**Should this unit ignore clicks? */
    public ignoreClicks: boolean;
    /**Did this unit already move in this turn? */
    public movedThisTurn: boolean;

    /**Lower left corner defining clickable area for this unit. Position is relative to this unit's position */
    private readonly lowerLeftCorner: Vector2;
    /**Upper right corner defining clickable area for this unit. Position is relative to this unit's position */
    private readonly upperRightCorner: Vector2;

    public OnClick(clickPosition: Vector2): void
    {
        console.log("Unit clicked");
    }

    public IsClicked(clickPosition: Vector2): boolean
    {
        let localizedClickPosition: Vector2 = Vector2.Substract(clickPosition, this.currentNode.position);

        return (localizedClickPosition.x > this.lowerLeftCorner.x && localizedClickPosition.y < this.lowerLeftCorner.y) && (localizedClickPosition.x < this.upperRightCorner.x && localizedClickPosition.y > this.upperRightCorner.y);
    }

    //#endregion

    public Draw(context: CanvasRenderingContext2D): void
    {
        CanvasHelper.DrawCircle(context, this.currentNode.position, 10, this.color);
        CanvasHelper.DrawText(context, this.currentHp.toString(), Vector2.Add(this.currentNode.position, new Vector2(0,-15)), 15, "Arial", this.color);
    }

    public TakeHit(dmg: number)
    {
        dmg = dmg - this.currentDefense > 0 ? dmg - this.currentDefense : 0;
        this.currentHp -= dmg;
    }
}