import { Clickable } from "./Clickable";
import { Utils } from "./Utils";
import { Vector2 } from "./Vector2";

type ClickAnyHandler = { (event: MouseEvent, clickPosition: Vector2, clickable: Clickable): void; };

export class InputManager
{
    private readonly clickables: Clickable[] = new Array(0);
    /**HTMLElement on which clicks will be handled in this manager */
    private readonly clickableElement: HTMLElement;
    /**Array of functions which should be called when any of the clickables is clicked */
    private readonly onClickAnyListeners: ClickAnyListener[] = new Array<ClickAnyListener>(0);

    /**
     * Creates new InputManager
     * @param element element on which InputManager will detect clicks
     */
    constructor(element: HTMLElement)
    {
        this.clickableElement = element;
        this.clickableElement.addEventListener("click", this.OnClick.bind(this));
    }

    public RegisterClickable(clickable: Clickable): void
    {
        if (Utils.IsElementInArray(this.clickables, clickable)) throw Error("This clickable is already registered");

        this.clickables.push(clickable);
    }

    public TryUnregisterClickable(clickable: Clickable): boolean
    {
        return Utils.TryRemoveFromArray(this.clickables, clickable);
    }

    public UnregisterClickable(clickable: Clickable): void
    {
        if (!this.TryUnregisterClickable) throw Error("This clickable is not registered");
    }

    /**Registers provided handler function to be called whenever any of the clickables is clicked  */
    public AddOnClickAnyListener(handler: ClickAnyHandler, listener: any): void
    {
        if (this.IsListenerRegistered(listener)) throw Error("This handler is already registered");
        else this.onClickAnyListeners.push(new ClickAnyListener(listener, handler.bind(listener)));
    }

    /**Removes listener so its handler won't be called when any clickable is clicked */
    public RemoveOnClickAnyListener(listener: any): void
    {
        let wasRemoved: boolean = false;
        for (let i = 0; i < this.onClickAnyListeners.length; i++)
        {
            if (this.onClickAnyListeners[i].listener === listener)
            {
                Utils.RemoveFromArrayAtIndex(this.onClickAnyListeners, i);
                wasRemoved = true;
                break;
            }
        }

        if(!wasRemoved) throw Error(`This listener is not registered. IsListenerRegistered: ${this.IsListenerRegistered(listener)}`);
    }

    private IsListenerRegistered(listener: any)
    {
        let isRegistered: boolean = false;
        for (let i = 0; i < this.onClickAnyListeners.length; i++)
        {
            if (this.onClickAnyListeners[i].listener === listener)
            {
                isRegistered = true;
                break;
            }
        }

        return isRegistered;
    }

    private OnClick(event: MouseEvent)
    {
        const rect = this.clickableElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top

        const clickPosition: Vector2 = new Vector2(x, y);

        this.clickables.forEach(clickable =>
        {
            if (!clickable.ignoreClicks && clickable.IsClicked(clickPosition))
            {
                clickable.OnClick(clickPosition);
                this.onClickAnyListeners.forEach(listener => listener.handler(event, clickPosition, clickable));
            } 
        });

    }
}

class ClickAnyListener
{
    public readonly listener: any;
    public readonly handler: ClickAnyHandler;

    constructor(listener: any, handler: ClickAnyHandler)
    {
        this.listener = listener;
        this.handler = handler;
    }
}