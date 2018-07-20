process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log('What\'s your age ? ');
process.stdin.on('data', (text) => {
	if(text.match(/^(\d{1,2})$/m))
	{
		console.log(2018 - text);
	}
	else
	{
		console.log("Vous devez rentrer un entier en 0 et 99");
	}
	process.exit();
});
