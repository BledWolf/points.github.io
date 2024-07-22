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
				"APIname": "generic/get",
				"table": JSON.stringify([{
					"db": "Users",
					"tableName": "Team",
					"collumns": ["id", "name"],
					"where": [{
						"key": "id",
						"operation": "=",
						"table":{
							"db": "Users",
							"tableName": "TeamMember",
							"collumns": ["idTeam"],
							"where": [{
								"key": "idMember",
								"operation": "=",
								"table": {
									"db": "Users",
									"tableName": "User",
									"collumns": ["id"],
									"where": [{
										"key": "token",
										"operation": "=",
										"value": localStorage.getItem("token")
									}]
								}
							}]
						}
					}]
				}])
			}
			, "team"
		))
	}).then((resMyTeams)=>{
		MyTeams = resMyTeams[0];
		console.log(MyTeams);
		loadHBS("teamsHBS", "teamsHBSres", {"teams": MyTeams});
		loadingSwitcher(false);
	})
}