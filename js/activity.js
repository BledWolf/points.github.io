// var selectedActivity;
let totalPoints = 0.0;

window.onload = () => {

	loadingSwitcher(true);

	initShared();

	let id = new URL(window.location).searchParams.get("id");
	let activity = new URL(window.location).searchParams.get("activity");

	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity/ids",
			},
			"activityTypes",
			"activity"
		))
	}).then((activityNamesAPIres)=>{
		console.log("activityNamesAPIres _ ", activityNamesAPIres[0]);
		activityNameList = activityNamesAPIres[0];
		activityNamesAPIres[0].push({"id": -1, "name": "All"})
		loadHBS("selectActivityHBS", "selectActivityHBSres", {"currentActivity": "All", "activityChoise": activityNamesAPIres[0]})
		
		if(id && activity){
			console.log(id, "(T.T)", activity);
			getActivities(id, activity);
		}else{
			window.location.replace("./activity.html?id=-1&activity=All");
		}

		// let paramURL = new URL(window.location).searchParams.get("selectedActivity");
		// if(paramURL){
		// 	selectedActivity = paramURL;
		// 	getActivities(selectedActivity, activityNamesAPIres[0].find((row)=>row.id == selectedActivity).name, false);
		// }

		loadingSwitcher(false);
	});
}



function getActivities(activityId, activityName, redirect = true){
	document.getElementById("selectActivityHBSdropdownSelected").innerHTML = activityName;

	loadingSwitcher(true);
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity/my/minimal",
				"activityId": activityId
			},
			"activities",
			"activity"
		))
	}).then((APIres)=>{
		console.log(APIres[0]);
		for(let i = 0; i < APIres[0].length; i++){
			APIres[0][i].time = APIres[0][i].date.split(" ")[1];
			APIres[0][i].date = APIres[0][i].date.split(" ")[0];
		}
		console.log(APIres[0]);
		loadHBS("activitiesHBS", "activitiesHBSres", {"activities": APIres[0]});
		loadingSwitcher(false);
		// selectedActivity = activityId;
		// if(redirect){
		// 	window.location.href = "./activity.html?selectedActivity=" + selectedActivity;
		// }
	})
}