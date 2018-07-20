import React, { Component } from 'react';

class TodoList extends Component
{
	constructor()
	{
		super();
		this.state = {
			item: '',
			items: [],
		}
	}

	render()
	{
		return(
			<div>
				<input type="text" />
				<button>A faire !</button>
			</div>
		);
	}
}

export default TodoList;
