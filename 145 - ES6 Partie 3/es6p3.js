const address = {
	city: "Lyon",
    state: "FR",
    zip: 69001
};

const sportList = ['Football', 'BasketBall']
const otherSportList = ['Boxe', 'Judo']

function display(adress, sports = ['Crapette', 'Bilboquet']){
	 console.log(adress.city, ...sports);
}

sportList.push(...otherSportList);

display(address, sportList);
display(address);
