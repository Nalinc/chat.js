define('core',[],function(){
	var self = {
		name: "test-panal",
		width: "50px",
		height: "100px"
	};

	return self
});
define('main',[
	'./core',
	],function(openudge){
	return openudge
});
