function Point(x, y)
{
    this.x = x;
    this.y = y;
}
Point.prototype.add = function (rhs)
{
    return new Vector(this.x + rhs.x, this.y + rhs.y);
}
Point.prototype.sub = function (rhs)
{
    return new Vector(this.x - rhs.x, this.y - rhs.y);
}
Point.prototype.toString = function()
{
    return "(" + this.x + "," + this.y + ")";
}
Point.prototype.distance = function (p2)
{
    return p2.sub(this).mag();
}

function Vector(x, y)
{
    Point.call(this, x, y);
}
Vector.prototype = new Point();
Vector.prototype.mag = function()
{
    return Math.sqrt(this.x * this.x + this.y * this.y);
}
Vector.prototype.unit = function ()
{
    var magnitude = this.mag();
    return new Vector(this.x * 1.0 / magnitude, this.y * 1.0 / magnitude);
}
Vector.prototype.dot = function (rhs)
{
    return this.x * rhs.x + this.y * rhs.y;
}
Vector.prototype.scale = function (scalar)
{
    return new Vector(this.x * scalar, this.y * scalar);
}
Vector.prototype.norm = function ()
{
    var magnitude = this.mag();
    return new Vector(this.y * 1.0 / magnitude, this.x * -1.0 / magnitude);
}
