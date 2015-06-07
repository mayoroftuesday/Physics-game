function Vector(x, y)
{
    this.x = x;
    this.y = y;
}
Vector.prototype =
{
    add: function (rhs)
    {
        return new Vector(this.x + rhs.x, this.y + rhs.y);
    },
    sub: function (rhs)
    {
        return new Vector(this.x - rhs.x, this.y - rhs.y);
    },
    toString: function ()
    {
        return "[" + this.x + "," + this.y + "]";
    },
    mag: function ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    unit: function ()
    {
        var magnitude = this.mag();
        return new Vector(this.x * 1.0 / magnitude, this.y * 1.0 / magnitude);
    },
    dot: function (rhs)
    {
        return this.x * rhs.x + this.y * rhs.y;
    },
    scale: function (scalar)
    {
        return new Vector(this.x * scalar, this.y * scalar);
    },
    norm: function ()
    {
        var magnitude = this.mag();
        return new Vector(this.y * 1.0 / magnitude, this.x * -1.0 / magnitude);
    }
}