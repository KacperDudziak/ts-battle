import { Node } from "./Node";
import { Vector2 } from "./Vector2";
import { AstarNode } from "./AstarNode";
import { CanvasHelper } from "./CanvasHelper";
import { Utils } from "./Utils";

export class Astar
{
    public readonly startNode: Node;
    public readonly targetNode: Node;

    private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("myCanvas");
    private readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d");

    constructor(startNode: Node, targetNode: Node)
    {
        this.startNode = startNode;
        this.targetNode = targetNode;
    }

    public FindPath(): Node[]
    {

        let openSet: AstarNode[] = new Array<AstarNode>(0);
        let closedSet: AstarNode[] = new Array<AstarNode>(0);

        let startAstarNode: AstarNode = new AstarNode(this.startNode, [null, 0]);
        startAstarNode.wasVisited = true;
        closedSet.push(startAstarNode);

        let currentNode = startAstarNode;

        // this.startNode.neighbours.forEach(neighbour =>
        // {
        //     openSet.push(new AstarNode(neighbour[0], [startAstarNode, Vector2.Distance(this.startNode.position, neighbour[0].position)]));          
        // });

        // let currentNode: AstarNode = this.GetNextNode(openSet, closedSet, startAstarNode);

        // clearly something is wrong with the way path node is being set

        // while (currentNode.node != this.targetNode)
        // {
        //     currentNode = this.GetNextNode(openSet, closedSet, currentNode);
        // }
        let iteration: number = 0;
        for (let i = 0; i < 500 && currentNode.node != this.targetNode; i++) 
        {
            currentNode = this.GetNextNode(openSet, closedSet, currentNode);
            iteration = i;
        }

        const path = this.TraceBack(currentNode);
        console.log(`Found path in ${iteration} iterations`);
        return path;
    }

    private GetNextNode(openSet: AstarNode[], closedSet: AstarNode[], currentNode: AstarNode)
    {
        currentNode.node.neighbours.forEach(neighbour =>
        {
            if (neighbour[0].astarNode != null && neighbour[0] != this.startNode)
            {
                if ((this.GetDistanceToStart(currentNode) + neighbour[1]) < (this.GetDistanceToStart(neighbour[0].astarNode.pathNode[0]) + neighbour[0].astarNode.pathNode[1]))
                {
                    neighbour[0].astarNode.pathNode = [currentNode, currentNode.pathNode[1] + neighbour[1]];
                }
            }
            else
            {
                neighbour[0].astarNode = new AstarNode(neighbour[0], [currentNode, neighbour[1]]);
            }

            if (!this.IsNodeInArray(openSet, neighbour[0]) && !this.IsNodeInArray(closedSet, neighbour[0]))
            {
                openSet.push(neighbour[0].astarNode);
            }
        });

        let nextBestNode: AstarNode = this.GetBestNode(openSet);
        Utils.RemoveFromArray(openSet, nextBestNode);
        closedSet.push(nextBestNode);
        if (nextBestNode.node != this.startNode && nextBestNode.node != this.targetNode) CanvasHelper.DrawCircle(this.context, nextBestNode.node.position, 7.5, "yellow");

        return nextBestNode;
    }

    private GetDistanceToStart(node: AstarNode): number
    {

        let distance: number = 0;
        let currentNode: AstarNode = node;

        while (currentNode.pathNode[0] != null)
        {
            distance += currentNode.pathNode[1];
            currentNode = currentNode.pathNode[0];
        }

        return distance;
    }

    private GetHeuristicDistanceToTarget(node: Node): number
    {
        return Vector2.Distance(node.position, this.targetNode.position);
    }

    /**Finds and returns node with smallest weight in provided array */
    private GetBestNode(nodes: AstarNode[]): AstarNode
    {
        let bestNode: AstarNode = nodes[0];
        let minWeight: number = this.GetNodeWeight(bestNode);

        for (let i = 1; i < nodes.length; i++)
        {
            const node = nodes[i];
            const weight = this.GetNodeWeight(node);
            if (weight < minWeight)
            {
                minWeight = weight;
                bestNode = node;
            }
        }

        return bestNode;
    }

    private GetNodeWeight(bestNode: AstarNode): number
    {
        return this.GetDistanceToStart(bestNode) + this.GetHeuristicDistanceToTarget(bestNode.node);
    }

    private IsNodeInArray(array: AstarNode[], node: Node): boolean
    {
        let found: boolean = false;
        array.forEach(element =>
        {
            if (element.node === node) found = true;
        });

        return found;
    }

    public TraceBack(node: AstarNode): Node[]
    {
        let path: Node[] = new Array<Node>(0);
        let currentNode: AstarNode = node;

        while (currentNode != null)
        {
            // if(currentNode.node != this.startNode && currentNode.node != this.targetNode) CanvasHelper.DrawCircle(this.context, currentNode.node.position, 7.5, "lightgreen");
            path.push(currentNode.node);
            currentNode = currentNode.pathNode == null ? null : currentNode.pathNode[0];
        }

        return path;
    }
}