let counter = 0;
let rows = [];



window.onload = () => {

	load();
	
}


function load(){
	loadingSwitcher(true);
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "generic/get",
				"table": JSON.stringify([{
					"db": "Activities",
					"tableName": "Activity",
					"collumns": ["code", "name"]
				}])
			},
			"index"
		));
	}).then((resApiActivities)=>{
		new Promise((succes)=>{
			succes(googleAPI(
				"GET",
				{
					"token": localStorage.getItem("token"),
					"APIname": "generic/get",
					"table": JSON.stringify([{
						"db": "Users",
						"tableName": "UserPoint",
						"collumns": ["codeName", "alle", "exp", "ro", "mi", "sim", "other", "tot", "ran"],
						"where": [{
							"key": "codeName",
							"operation": "=",
							"table":{
								"db": "Users",
								"tableName": "User",
								"collumns": ["codeName"],
								"where": [{
									"key": "token",
									"operation": "=",
									"value": localStorage.getItem("token")
								}]
							}
						}]
					}])
				},
				"index"
			));
		}).then((resApiUser)=>{
			console.log("DONE_get()");
			console.log(resApiUser);
			var points = resApiUser[0][0];
			console.log(points);
			console.log(resApiActivities);

			var pointsRes = {};
			var keys = Object.keys(points);
			// console.log(keys);
			for(let i = 0; i < keys.length; i++){
				for(let j = 0; j < resApiActivities[0].length; j++){
					// console.log(resApiActivities[0][j].code);
					// console.log(keys[i]);
					if(keys[i] == resApiActivities[0][j].code){
						pointsRes[resApiActivities[0][j].name] = points[keys[i]];
						// console.log(pointsRes);
					}
				}
			}
			console.log(pointsRes);
			loadHBS("indexHBS", "indexHBSres", {"points": points, "pointsTranslated": pointsRes});
			loadingSwitcher(false);
			
		})
		
	})
}