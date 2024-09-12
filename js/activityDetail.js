
var activityPoints = [];
var activityNameList = [];
var idActivity;

window.onload = () => {

	idActivity = new URL(window.location).searchParams.get("id");
	console.log("ID _ " + idActivity);
	loadingSwitcher(true);

	initShared();

	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity/points/list",
				"idActivity": idActivity
			},
			"activityPointsCodeNames",
			"activity"
		));
	}).then((activityPointsAPIres) => {
		console.log("activityPointsAPIres _ ", activityPointsAPIres);
		for(let i = 0; i < activityPointsAPIres.length; i++){
			for(let j = 0; j < activityPointsAPIres[i].length; j++){
				activityPoints.push(activityPointsAPIres[i][j].codeName);
			}
		}

		console.log("activityPoints _ ", activityPoints);

		new Promise((succes)=>{
			succes(getActivity(idActivity));
		}).then(()=>{
			loadingSwitcher(false);
		})
	})

}



function getActivity(activityId){
	loadingSwitcher(true);
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity/points",
				"activityPoints": JSON.stringify(activityPoints),
				"activityId": activityId
			},
			"activityPoints",
			"activity"
		))
	}).then((APIres)=>{
		console.log(APIres[0][0]);

		let points = [];
		for(let j = 0; j < Object.keys(APIres[0][0]).length; j++){
			if(
				Object.keys(APIres[0][0])[j] != "id"
				&& Object.keys(APIres[0][0])[j] != "confirmedByUserId"
				&& Object.keys(APIres[0][0])[j] != "date"
			){
				points.push({"name": Object.keys(APIres[0][0])[j], "value": APIres[0][0][Object.keys(APIres[0][0])[j]]})
			}
		}

		let activity = {
			"id": APIres[0].id,
			"date": APIres[0].date,
			"confirmedByUserId": APIres[0].confirmedByUserId,
			"points": points
		};

		console.log("activities _ ", activity);

		loadHBS("activityHBS", "activityHBSres", {"activity": activity});
		loadingSwitcher(false);
	})
}