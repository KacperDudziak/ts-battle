import { Drawable } from "./Drawable";
import { Utils } from "./Utils";

/**Draws objects on canvas every frame */
export class Painter
{
    /**Nuber of layers this painter has */
    public readonly layerNumber: number;

    /**Context on which objects will be drawn */
    private readonly context: CanvasRenderingContext2D;

    /**Objects will be drawn starting from layer index 0, so objects from layer with highest index will always be on top */
    private readonly layers: Drawable[][];

    constructor(layerNumber: number, context: CanvasRenderingContext2D)
    {
        this.layerNumber = layerNumber;
        this.layers = new Array<Array<Drawable>>(layerNumber);
        this.context = context;

        for (let i = 0; i < layerNumber; i++) 
        {    
            this.layers[i] = new Array<Drawable>(0);
        }

        window.requestAnimationFrame(this.DrawAll.bind(this))
    }

    /**Draws all layers */
    private DrawAll()
    {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        for (let i = 0; i < this.layerNumber; i++) 
        {
            this.layers[i].forEach(drawable => drawable.Draw(this.context));
        }

        window.requestAnimationFrame(this.DrawAll.bind(this))
    }

    /**Registers drawable to be drawn every frame */
    public RegisterDrawable(drawable: Drawable, layerIndex: number): void
    {
        if (layerIndex > this.layerNumber || layerIndex < 0) throw Error(`Invalid layer index. There are ${this.layerNumber} layers and provided layer index was ${layerIndex}`);

        this.layers[layerIndex].push(drawable);
    }

    public TryUnregisterDrawable(drawable: Drawable): boolean
    {
        let unregistered: boolean = false;
        for (let layerId = 0; layerId < this.layerNumber; layerId++)
        {
            if (Utils.TryRemoveFromArray(this.layers[layerId], drawable))
            {
                unregistered = true;
                break;
            }
        }

        return unregistered;
    }

    public UnregisterDrawable(drawable: Drawable): void
    {
        if (!this.TryUnregisterDrawable(drawable)) throw new Error("This drawable is not registered");
    }
}