let counter = 0;
let rows = [];



window.onload = () => {

	load();
	
}


function load(){
	loadingSwitcher(true);
	loadHBS("breadCrumbsHBS", "breadCrumbsHBSres", breadCrumbs);
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "user/me/card"
			},
			"userPoints",
			"index"
		));
	}).then((card)=>{
		loadHBS("indexHBS", "indexHBSres", card[0][0]);
		loadingSwitcher(false);
	})
}