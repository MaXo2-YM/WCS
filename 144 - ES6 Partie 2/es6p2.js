'use strict';

// const profile = {
//     name: 'Alex',
// 	getName: () => console.log(this.name)
// };
// ne marche pas.

const profile = {
    name: 'Alex',
	getName: function() { console.log(this.name) }
};

profile.getName();
