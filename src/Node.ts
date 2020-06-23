import { Vector2 } from "./Vector2";
import { AstarNode } from "./AstarNode";
import { CanvasHelper } from "./CanvasHelper";
import { Drawable } from "./Drawable";
import { Clickable } from "./Clickable";

/**Single node */
export class Node implements Drawable, Clickable
{
    /**Tuples with all nodes reachable directly from this node and distance to them */
    public readonly neighbours: [Node, number][] = new Array<[Node, number]>(0);
    /**Position of this node */
    public readonly position: Vector2;

    public astarNode: AstarNode = null;

    private readonly radious = 7.5;
    
    constructor(position: Vector2) 
    {
        this.position = position;
    }
    ignoreClicks: boolean;

    //#region clickable
    
    OnClick(clickPosition: Vector2): void
    {
        console.log("Node clicked")
    }
    
    IsClicked(clickPosition: Vector2): boolean
    {
        return Vector2.Distance(clickPosition, this.position) <= this.radious;
    }

    //#endregion

    public Draw(context: CanvasRenderingContext2D): void
    {
        CanvasHelper.DrawCircle(context, this.position, this.radious, "white");
    }
}