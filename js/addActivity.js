let totalPoints = 0.0;
let pointsToPush = [];
let activityPoints = [];
let activityId;

let usersSelected = [];
let Users = [];
let filters = [];
let pagination;

window.onload = () => {

	loadingSwitcher(true);

	initShared();

	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity/ana/minimal"
			},
			"activityList",
			"activity"
		));
	}).then((activityList) => {
		console.log("activityList _ ", activityList[0]);
		loadHBS("selectActivityHBS", "selectActivityHBSres", {"currentActivity": "Activity", "activityChoise": activityList[0]});
		console.log(breadCrumbs);

		pagination = {
			"page": 0,
			"maxPages": 0,
			"maxResSinglePage": 5
		}
		getFilteredUsers();
		loadingSwitcher(false);
	});

}





function getActivityForm(id, activityName){
	loadingSwitcher(true);
	activityId = id;
	new Promise((succes) => {
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity/points/ana",
    			"activityAnaId": id,
			},
			"Points",
			"activity"
		))
	}).then((pointsResAPI) => {
		var points = [];
		var pointsIn = [];
		console.log("pointsResAPI _ ", pointsResAPI);

		for(let i = 0; i < pointsResAPI[0].length; i++){
			var point = pointsResAPI[0][i];
			console.log(point);
			var range = [];
			for(let n = Number(point.min); n <= point.max; n = n + Number(point.add)){
				// console.log(n);
				range.push(n);
			}
			point["range"] = range;
			point.optional = point.optional == 1 ? true : false;
			pointsIn.push(point);
			if(!point.optional){
				console.log("POINT_", point);
				totalPoints += Number(point.min);
				pointsToPush.push({"codeName": point.codeName, "value": Number(point.min)});
			}
			activityPoints.push(point.codeName);
		}
		points.push(pointsIn);

		var pointsIn = [];
		for(let i = 0; i < pointsResAPI[1].length; i++){
			var point = pointsResAPI[1][i];
			var range = [];
			for(let n = Number(point.min); n < point.max; n = n + Number(point.add)){
				// console.log(n);
				range.push(n);
			}
			point["range"] = range
			point.optional = point.optional == 1 ? true : false;
			pointsIn.push(point);
			if(!point.optional){
				console.log("POINT_", point);
				totalPoints += Number(point.min);
				pointsToPush.push({"codeName": point.codeName, "value": Number(point.min)});
			}
			activityPoints.push(point.codeName);
		}
		points.push(pointsIn);

		console.log("points _ ", points);
		let inputHBS = [];
		if(pointsResAPI.length >= 1){
			inputHBS.push({"name": "Base", "points": points[1]})
		}
		inputHBS.push({"name": activityName, "points": points[0]});
		loadHBS("addActivityHBS", "addActivityHBSres", {"pointList": inputHBS });
		document.getElementById("totalPoints").innerHTML = totalPoints;
		console.log("pointsToPush_", pointsToPush);
		console.log("activityPoints_", activityPoints);
		loadingSwitcher(false);
	})
}



function setPoint(codeName, value){
	console.log(codeName, "_-_", value);
	totalPoints = totalPoints - Number(document.getElementById(codeName).innerHTML) + Number(value);
	document.getElementById(codeName).innerHTML = value;
	console.log("totalPoints_", totalPoints);
	document.getElementById("totalPoints").innerHTML = totalPoints;
	pointsToPushADDorUPDATEorREMOVE(codeName, Number(document.getElementById(codeName).innerHTML));
}



function checkActivity(codeName){
	console.log("codeName _ ", codeName);
	if(document.getElementById(codeName + "Check").checked){
		document.getElementById(codeName).disabled = false;
		totalPoints += Number(document.getElementById(codeName).innerHTML);
		pointsToPushADDorUPDATEorREMOVE(codeName, Number(document.getElementById(codeName).innerHTML));
	}else{
		document.getElementById(codeName).disabled = true;
		totalPoints -= Number(document.getElementById(codeName).innerHTML);
		pointsToPushADDorUPDATEorREMOVE(codeName, Number(document.getElementById(codeName).innerHTML), true);
	}
	document.getElementById("totalPoints").innerHTML = totalPoints;
}



function pointsToPushADDorUPDATEorREMOVE(codeName, value, remove = false){
	console.log("pointsToPush_", pointsToPush);
	for(let i = 0; i < pointsToPush.length; i++){
		if(pointsToPush[i].codeName == codeName){
			if(remove){
				pointsToPush.splice(i, 1);
			}else{
				pointsToPush[i].value = value;
			}
			console.log("pointsToPush_", pointsToPush);
			return;
		}
	}
	pointsToPush.push({"codeName": codeName, "value": value});
	console.log("pointsToPush_", pointsToPush);
}



function submit(){
	loadingSwitcher(true);

	console.log(new Date());
	let points = [
		{"key": "date", "value": dateParse(new Date())},
		{"key": "activityAnaId", "value": activityId},
		{"key": "total", "value": totalPoints}
	];

	for(let i = 0; i < activityPoints.length; i++){
		let added = false;
		for(let j = 0; j < pointsToPush.length; j++){
			if(activityPoints[i] == pointsToPush[j].codeName){
				points.push({"key": activityPoints[i], "value": pointsToPush[j].value})
				added = true;
				break;
			}
		}
		if(!added){
			points.push({"key": activityPoints[i], "value": 0})
		}
	}

	new Promise((succes)=>{
		succes(googleAPI(
			"POST",
			{
				"token": localStorage.getItem("token"),
				"APIname": "activity",
				"points": JSON.stringify(points)
			}
		));
	}).then(()=>{
		loadingSwitcher(false);
	})
}










function getFilteredUsers(focusElem = null){
	loadingSwitcher(true);
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"token": localStorage.getItem("token"),
				"APIname": "user/table/minimal",
				"filters": JSON.stringify(filters),
				"pagination": JSON.stringify(pagination)
			},
			"userTable",
			"activity"
		))
	}).then((usersRes)=>{
		if(filters.length == 0){
			for(let j = 0; j < Object.keys(usersRes.res[0][0]).length; j++){
				if(Object.keys(usersRes.res[0][0])[j] != "userId"){
					filters.push({"key": Object.keys(usersRes.res[0][0])[j], "value": "", "focus": false});
				}
			}
		}

		pagination.maxPages = usersRes.pagination[0].pages;
		console.log(pagination);

		console.log("filters_", filters);
		loadHBS("usersHBS", "usersHBSres", {"users": usersRes.res[0], "filters": filters, "pagination": pagination});
		loadingSwitcher(false);

		let elemOut = document.getElementById("focus");
		console.log(elemOut);
		console.log(focusElem);
		if(focusElem && elemOut){
			elemOut.focus();
			elemOut.selectionStart = focusElem.selectionStart;
			elemOut.selectionEnd = focusElem.selectionEnd;
		}
		document.getElementById("paginator").innerHTML = pagination.maxResSinglePage;
	});
}



function userSelection(id, elemHTML){
	console.log(elemHTML);
	let finded = false;
	for(let i = 0; i < usersSelected.length; i++){
		if(usersSelected[i] == id){
			finded = i;
			break;
		}
	}
	console.log(usersSelected, "_", finded);
	if(finded !== false){
		for(let i = finded; i < usersSelected.length - 1; i++){
			usersSelected[i] = usersSelected[i + 1];
		}
		usersSelected.splice(usersSelected.length - 1, 1);
		elemHTML.classList.remove("selected");
	}else{
		usersSelected.push(id);
		elemHTML.classList.add("selected");
	}
	console.log(usersSelected);
}



function filter(col, value, elem){
	for(let i = 0; i < filters.length; i++){
		filters[i].focus = false;
		if(filters[i].key == col){
			filters[i].value = value;
			filters[i].focus = true;
		}
	}

	getFilteredUsers(elem);
}

function paginate(maxRows){
	pagination = {
		"page": 0,
		"maxPages": 0,
		"maxResSinglePage": maxRows
	};
	getFilteredUsers();
}