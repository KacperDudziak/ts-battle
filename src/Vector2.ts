/**Two dimensional vector. This calss is immutable */
export class Vector2
{
    public readonly x: number;
    public readonly y: number;


    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    /**Adds vectorA to vectorB and returns new Vector2 created as the result*/
    static Add(vectorA: Vector2, vectorB: Vector2): Vector2
    {
        return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
    }

    /**Substracts vectorB from vectorA and returns new Vector2 created as the result*/
    static Substract(vectorA: Vector2, vectorB: Vector2): Vector2
    {
        return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
    }

    /**Multiplies vector a by vector b and returns new Vector2 created as the result*/
    static Multiply(vector: Vector2, multipiler: number): Vector2
    {
        return new Vector2(vector.x * multipiler, vector.y * multipiler);
    }

    /**Computes distance between two vecotrs and returns the result */
    static Distance(vectorA: Vector2, vectorB: Vector2): number
    {
        let a = vectorA.x - vectorB.x;
        let b = vectorA.y - vectorB.y;
        a *= a;
        b *= b;

        return Math.sqrt(a + b);
    }

    /**Returns true if two vectors are equal */
    static Equals(vectorA: Vector2, vectorB: Vector2): boolean
    {
        return vectorA.x === vectorB.x && vectorA.y === vectorB.y;
    }
}