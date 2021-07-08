module.exports = {
	name: 'error',
	once: false,
	execute(client, e) {
        console.log(e);
        var error = err.toString();
        console.log('\n\n' + error);
    }
};