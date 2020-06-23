export namespace Utils
{
    export function TryRemoveFromArray<T>(array: T[], element: T): boolean
    {
        let foundElement: boolean = false;

        for (let i = 0; i < array.length; i++) 
        {
            if (array[i] === element)
            {
                foundElement = true;
                array.splice(i, 1);
                break;
            }
        }

        return foundElement
    }

    /**Removes first occurrence of given object in an array */
    export function RemoveFromArray<T>(array: T[], element: T): void
    {
        if (!TryRemoveFromArray(array, element)) throw Error("Couldn't find specified element in the provided array");
    }

    /**Checks whether object is in an array and returns true if it is */
    export function IsElementInArray<T>(array: T[], element: T): boolean
    {
        let foundElement: boolean = false;
        for (let i = 0; i < array.length; i++) 
        {
            if (array[i] === element)
            {
                foundElement = true;
                break;
            }
        }

        return foundElement;
    }

    /**Removes object from an array at specified index */
    export function RemoveFromArrayAtIndex<T>(array: T[], index: number)
    {
        array.splice(index, 1);
    }
}