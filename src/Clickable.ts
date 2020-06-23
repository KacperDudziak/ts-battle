import { Vector2 } from "./Vector2";

/**Implemeted by all classes representing objects which can be clicked by a player */
export interface Clickable
{
    /**If this is set to true OnClock won't be called when object is clicked */
    ignoreClicks: boolean;

    /**Called when this object is clicked */
    OnClick(clickPosition: Vector2): void;

    /**Returns true if clickPosition is on this Clickable object */
    IsClicked(clickPosition: Vector2): boolean;
}