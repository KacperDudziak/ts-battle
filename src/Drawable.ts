/**Interface for objects which should have graphical representation on canvas */
export interface Drawable
{
    /**Draws object on canvas */
    Draw(context: CanvasRenderingContext2D): void;
}