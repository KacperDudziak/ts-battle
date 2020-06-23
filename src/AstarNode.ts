import { Node } from "./Node";
import { Astar } from "./Astar";
import { Vector2 } from "./Vector2";

/**Represents node used by A* algorithm */
export class AstarNode
{
    /**Node instance wrapped by this AstarNode */
    public readonly node: Node;
    /**Follow pathNodes to get shortest path to the start node from any given AstarNode. 
     * Number in this tuple is distance from this node to path node */
    public pathNode: [AstarNode, number];
    public wasVisited: boolean = false;

    constructor(node: Node, pathNode: [AstarNode, number])
    {
        this.node = node;
        this.pathNode = pathNode;
        this.node.astarNode = this;
    }

    static Equals(nodeA: AstarNode, nodeB: AstarNode): boolean
    {
        return Vector2.Equals(nodeA.node.position, nodeB.node.position) && Vector2.Equals(nodeA.pathNode[0].node.position, nodeB.pathNode[0].node.position) && nodeA.wasVisited === nodeB.wasVisited;
    }
}