import './main.scss';
import { Node } from './Node';
import { Vector2 } from './Vector2';
import { CanvasHelper } from './CanvasHelper';
import { Astar } from './Astar';
import { Painter } from './Painter';
import { InputManager } from './InputManager';

export class GameMap
{
    private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("myCanvas");
    private readonly context: CanvasRenderingContext2D = this.canvas.getContext("2d");

    private readonly width: number = 20;
    private readonly height: number = 10;
    private readonly space: number = 50;
    private readonly margin: number = 10;
    private readonly nodeRadious = 7.5;

    private readonly startPosition: Vector2 = new Vector2(0, 5);
    private readonly targetPosition: Vector2 = new Vector2(this.width - 1, 4);
    private readonly obstacles: Vector2[] = [new Vector2(10, 3), new Vector2(10, 4), new Vector2(10, 5), new Vector2(10, 6), new Vector2(9, 7), new Vector2(8, 7)];
    /**Get nodes using their coordinates like nodes[y][x] */
    public readonly nodes: Node[][] = new Array<Array<Node>>(this.height);

    constructor(painter: Painter, inputManager: InputManager)
    {
        this.GenerateNodes();

        painter.RegisterDrawable(this, 0);
        this.nodes.forEach(nodes => nodes.forEach(node => inputManager.RegisterClickable(node)));
    }

    private GenerateNodes()
    {
        for (let y = 0; y < this.height; y++) 
        {
            const column: Array<Node> = new Array<Node>(this.width);
            this.nodes[y] = column;

            for (let x = 0; x < this.width; x++) 
            {
                if (!this.CheckIfObstacle(x, y))
                {
                    const position = new Vector2(this.margin + (x * this.space), this.margin + (y * this.space));
                    const node = new Node(position);
                    let neighbour: Node;
                    if (x - 1 >= 0 && !this.CheckIfObstacle(x - 1, y))
                    {
                        neighbour = column[x - 1];
                        const distance = Vector2.Distance(node.position, neighbour.position);
                        node.neighbours.push([neighbour, distance]);
                        neighbour.neighbours.push([node, distance]);
                        // CanvasHelper.DrawLine(this.context, node.position, neighbour.position, 1);
                    }
                    if (y - 1 >= 0 && !this.CheckIfObstacle(x, y - 1))
                    {
                        neighbour = this.nodes[y - 1][x];
                        const distance = Vector2.Distance(node.position, neighbour.position);
                        node.neighbours.push([neighbour, distance]);
                        neighbour.neighbours.push([node, distance]);
                        // CanvasHelper.DrawLine(this.context, node.position, neighbour.position, 1);
                    }


                    // CanvasHelper.DrawCircle(this.context, node.position, this.nodeRadious);

                    column[x] = node;
                }
            }
        }

    }


    public FindPath(from: Node, to: Node): Node[]
    {
        let astar: Astar = new Astar(from, to);
        let path: Node[] = astar.FindPath();
        this.nodes.forEach(nodeSet =>
        {
            nodeSet.forEach(node => node.astarNode = null);
        });

        return path;
    }

    private CheckIfObstacle(x: number, y: number): boolean
    {
        let isObstacle: boolean = false;
        this.obstacles.forEach(obstaclePosition =>
        {
            if (obstaclePosition.x == x && obstaclePosition.y == y) isObstacle = true;
        });

        return isObstacle;
    }

    public Draw(context: CanvasRenderingContext2D)
    {
        for (let i = 0; i < this.nodes.length; i++) 
        {
            const element = this.nodes[i];
            for (let j = 0; j < element.length; j++) 
            {
                const node = element[j];

                if (node != null)
                {
                    node.neighbours.forEach(neighbour => 
                    {
                        CanvasHelper.DrawLine(context, node.position, neighbour[0].position, 1);    
                    });
                } 
            }
        }

        for (let i = 0; i < this.nodes.length; i++) 
        {
            const element = this.nodes[i];
            for (let j = 0; j < element.length; j++) 
            {
                const node = element[j];

                if (node != null) node.Draw(context);
            }
        }
    }
}