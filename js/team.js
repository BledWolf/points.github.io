let MyTeams = [];

window.onload = () => {

	initShared();

	loadTeam();
}

function loadTeam(){
	loadingSwitcher(true);
	
	new Promise((succes)=>{
		succes(googleAPI(
			"GET"
			, {
				"token": localStorage.getItem("token"),
				"APIname": "team/my"
			}
			, "myTeams"
			, "team"
		))
	}).then((resMyTeams)=>{
		MyTeams = resMyTeams[0];
		console.log(MyTeams);
		loadHBS("teamsHBS", "teamsHBSres", {"teams": MyTeams});
		loadingSwitcher(false);
	})
}