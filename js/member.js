let counter = 0;
let rows = [];



window.onload = () => {

	initShared();

	let id = new URL(window.location).searchParams.get("id");
	if(id && id > -1){
		load(id);
	}	
}


function load(id){
	loadingSwitcher(true);
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "user/id/card",
				"userId": id
			},
			"userPoints",
			"index"
		));
	}).then((card)=>{
		loadHBS("indexHBS", "indexHBSres", card[0]);
		loadingSwitcher(false);
	})
}