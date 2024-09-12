let loading;
let loadingCounter = 0;
let BEurl = "https://script.google.com/macros/s/AKfycby-JKnZq5gdaG1k4KAzwT4fmxeWLf1fX632zX7teEbPReXqwLXQ1xkDd4aJcQ5uwSQl/exec";
let breadCrumbs = [];
/**
breadCrumb = [
	{
		"page": "activity",
		"breadCrumbs": [
			{
				"url": "/",
				"displayName": "Activity"
			},{
				"url": "/ActivityDetail.html?id=2",
				"displayName": "Detail"
			}
		]
	}
]
/**/

function initShared(){
	breadCrumbs = JSON.parse(localStorage.getItem("breadCrumbs"));
	console.log("breadCrumbs_", breadCrumbs);
	loadHBS("breadCrumbsHBS", "breadCrumbsHBSres", {"breadCrumbs": breadCrumbs});
}

function loadComponents(){
	$("#menuLink").load("./html_components/menu.html");
}

function googleAPI(method, body, saveName, page){
	try{
		return new Promise((success)=>{
			console.log("TOKEN:", body["token"], " _ ", localStorage.getItem("token"));
			if(Object.keys(body).includes("token") && (localStorage.getItem("token") == null || localStorage.getItem("token") == undefined)){
				window.location.href = "./logIn.html";
				return;
			}
			var Else = true;
			if(method == "GET" && saveName){
				var loadData = LOAD({
					"saveName": saveName,
					"page": page,
					"body": body
				});
				console.log("LocalStorage:", loadData);
				if(loadData != false){
					success(loadData);
					Else = false;
				}
			}
			if(Else){
				console.log(body);
				jQuery.ajax({
					url: BEurl,
					data: body,
					method: method,
					dataType: "json",
					success: (res) => {
						if(res.pagination){
							res.res = {"res": res.res, "pagination": res.pagination}
						}
						if(res.status == "401"){
							console.log("TOKEN:", body["token"]);
							window.location.href = "./logIn.html";
							return;
						}
						else if(method == "GET" && res.status == "200" && saveName){
							SAVE({
								"page": page,
								"saveName": saveName,
								"body": body,
								"data": res.res
							});
						}else if(res.status == "400"){
							throw "Unauthorized"
						}
						success(res.res);
					},
					error: (err) => {
						console.log(err);
					}
				})
			}
		});
	}catch(err){
		console.log("ERROR:", err);
	}
}





function loadHBS(HbsClass, HtmlOutputClass, data){
	let template = Handlebars.compile(
		document.getElementById(HbsClass).innerHTML
	);
	console.log(data);
	console.log("HbsClass:", HbsClass, "_HtmlOutputClass:", HtmlOutputClass, "_data:", data);
	htmlText = template(data);
	// console.log(htmlText);
	document.getElementById(HtmlOutputClass).innerHTML = htmlText;
}



function loadingSwitcher(loadingStatus){
	console.log("LOADING . . ." + loadingStatus + " _ Counter: " + loadingCounter);
	if(loadingStatus){
		loadingCounter++;
	}else{
		loadingCounter--
	}
	if(loadingCounter == 0){
		loading = false;
	}else if(loadingCounter > 0){
		loading = true;
	}
	loadHBS("loadingHBS", "loadingHBSres", {"loading": loading});
}





function SAVE(SAVEobj){
	var date = new Date();
	date.setDate(date.getDate() + 2);
	console.log(date);
	console.log(SAVEobj);
	var storage = null;
	console.log(localStorage.getItem(SAVEobj.page));
	if(localStorage.getItem(SAVEobj.page) != null){
		storage = JSON.parse(localStorage.getItem(SAVEobj.page));
		console.log(storage);
		for(let i = 0; i < storage.length; i++){
			console.log("--__--__--__--");
			if(JSON.stringify(storage[i].body) == JSON.stringify(SAVEobj.body) && storage[i].saveName == SAVEobj.saveName){
				console.log("--__--SAVING2222222222222222222222--__--");
				storage[i].data = SAVEobj.data;
				localStorage.setItem(SAVEobj.page, storage);
				console.log(SAVEobj.saveName, storage);
				console.log(localStorage.getItem(SAVEobj.page));
				return;
			}
		}
		console.log("--__--SAVING3333333333333333333--__--");
		storage.push(SAVEobj);
		localStorage.setItem(SAVEobj.page, JSON.stringify(storage));
		return;
	}
	console.log("--__--SAVING11111111111111111--__--");
	localStorage.setItem(SAVEobj.page, JSON.stringify([SAVEobj]));
	console.log(SAVEobj.saveName + "=" + JSON.stringify(SAVEobj));
}



function LOAD(LOADobj){
	if(localStorage.getItem(LOADobj.page) != null && localStorage.getItem(LOADobj.page) != undefined){
		var storage = JSON.parse(localStorage.getItem(LOADobj.page));
		// console.log(storage);
		// console.log(LOADobj);
		for(let i = 0; i < storage.length; i++){
			// console.log(storage[i]);
			// console.log(storage[i].body + " == " + LOADobj.body + " && " + storage[i].saveName + " == " + LOADobj.saveName);
			if(JSON.stringify(storage[i].body) == JSON.stringify(LOADobj.body) && storage[i].saveName == LOADobj.saveName && storage[i].page == LOADobj.page){
				return storage[i].data;
			}
		}
	}
	return false;
}





function clearCache() {
	if(confirm("Are you sure to clear the cache? if you do that, you are redirected in the index page")){
		localStorage.removeItem("index");
		localStorage.removeItem("team");
		localStorage.removeItem("activity");
		location.reload();
	}
}



function logOut(){
	localStorage.removeItem("token");
	window.location.href = "./logIn.html";
}



function nav(navObj, BreadClicked = false, clear = false, override = false){
	// navObj = {
	//	'url': '/',
	//	'displayName': 'Index',
	// };

	/**
	breadCrumbs = [
		{
			"url": "/",
			"displayName": "Activity",
			"active": true
		},{
			"url": "/ActivityDetail.html?id=2",
			"displayName": "Detail",
			"active": false
		}
	]
	/**/

	navObj.active = true;

	console.log(BreadClicked, "_", clear);
	console.log(breadCrumbs);
	console.log(navObj);

	// If i nav, es using MENU LINKS
	if(clear){
		breadCrumbs = [];
		breadCrumbs.push(navObj);
	}else{

		// Get current breadCrumb INDEX
		var currentIndex = -1;
		for(let j = breadCrumbs.length - 1; j >= 0; j--){
			console.log(j);
			console.log(breadCrumbs[j]);
			if(breadCrumbs[j].active)
			{
				currentIndex = j;
				break;
			}
		}
		console.log(currentIndex);
		breadCrumbs[currentIndex].active = false;

		// If navigation is Equal to Next Bread
		if(breadCrumbs[currentIndex + 1] && navObj.url == breadCrumbs[currentIndex + 1].url){
			BreadClicked = true;
		}
		else if(navObj.url == breadCrumbs[currentIndex].url){
			BreadClicked = true;
			// To NOT apply
			// because with BreadClicked==true
			// this param is useless
			// currentIndex--;
		}

		// If i click the breadCrumb (not a link or button or ...)
		if(BreadClicked){
			for(let j = breadCrumbs.length - 1; j >= 0; j--){
				console.log(breadCrumbs[j], "_", navObj, "_", breadCrumbs[j] == navObj)
				if(breadCrumbs[j].url == navObj.url && breadCrumbs[j].displayName == navObj.displayName)
				{
					breadCrumbs[j].active = true
				}
			}
		}

		// If i doesn't click the breadCrumb
		else{
			console.log(breadCrumbs.length, " - ", currentIndex);
			if(currentIndex < breadCrumbs.length - 1){
				breadCrumbs.splice(currentIndex + 1, breadCrumbs.length - currentIndex - 1);
			}
			if(override){
				breadCrumbs[currentIndex] = navObj;
			}else{
				breadCrumbs.push(navObj);
			}
		}
	}

	// LOG and NAVIGATE
	console.log(breadCrumbs);
	console.log(breadCrumbs[0].url, "_", breadCrumbs[0].displayName, "_", breadCrumbs[0].active);
	localStorage.setItem("breadCrumbs", JSON.stringify(breadCrumbs));
	window.location.replace(navObj.url);
}



// Handlebars.registerHelper(
//   "compare", function (variableOne, comparator, variableTwo) {
//     if (eval(variableOne + comparator + variableTwo)) {
//       return true
//     } else {
//       return false
//     }
// });



function dateParse(date, dateString = null){
	let resDate;

	if(dateString){
		// let dateTime = dateString.split(' ');
		// date = dateTime[0].split('/');
		// let time = dateTime[1].split(':');

		resDate = new Date(dateString);
	}else{
		resDate =
			date.getDate().toString().padStart(2, "0")
			+ "/" + (date.getMonth() + 1).toString().padStart(2, "0")
			+ "/" + date.getFullYear()
			+ " " + date.getHours().toString().padStart(2, "0")
			+ ":" + date.getMinutes().toString().padStart(2, "0")
			+ ":" + date.getSeconds().toString().padStart(2, "0")
	}

	return resDate;
}