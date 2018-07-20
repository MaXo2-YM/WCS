export class Monster
{
	constructor(options)
	{
		this._name = options.name;
		this._health = 100;
	}

	heal()
	{
		this._health += 10;
	}

	get name()
	{
		return this._name;
	}

	get health()
	{
		return this._health;
	}
}
