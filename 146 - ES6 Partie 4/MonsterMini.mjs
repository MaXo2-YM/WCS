import {Monster} from './Monster';

export class MonsterMini extends Monster
{
	constructor(options)
	{
		super(options);
		this._health = 50;
	}

	heal()
	{
		this._health += 5;
	}
}
