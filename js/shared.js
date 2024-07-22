let loading;
let BEurl = "https://script.google.com/macros/s/AKfycby-JKnZq5gdaG1k4KAzwT4fmxeWLf1fX632zX7teEbPReXqwLXQ1xkDd4aJcQ5uwSQl/exec";
let breadCrumbs = [];
let breadCrumbCurrent = {};
/*
let breadCrumbCurrent = {
	'page': 'index',
	'breadCrumbs': [
		{
			'url': '/',
			'nameDisplayed': 'Index',
			'active': true
		}
	]
};
*/

function initShared(){
	// console.log("CONTENT _ ", document.getElementById("menuLinkSource").innerHTML);
	// document.getElementById("menuLink").contentDocument.write();
}

function loadComponents(){
	$("#menuLink").load("./html_components/menu.html");
}

function googleAPI(method, body, saveName){
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
						if(res.status == "401"){
							console.log("TOKEN:", body["token"]);
							window.location.href = "./logIn.html";
							return;
						}
						else if(method == "GET" && res.status == "200" && saveName){
							SAVE({
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
	console.log("LOADING . . ." + loadingStatus);
	loading = loadingStatus;
	loadHBS("loadingHBS", "loadingHBSres", {"loading": loadingStatus});
}





function SAVE(SAVEobj){
	var date = new Date();
	date.setDate(date.getDate() + 2);
	console.log(date);
	console.log(SAVEobj);
	var storage = null;
	console.log(localStorage.getItem(SAVEobj.saveName));
	if(localStorage.getItem(SAVEobj.saveName) != null){
		storage = JSON.parse(localStorage.getItem(SAVEobj.saveName));
		// console.log(storage);
		for(let i = 0; i < storage.length; i++){
			// console.log("--__--__--__--");
			if(JSON.stringify(storage[i].body) == JSON.stringify(SAVEobj.body) && storage[i].saveName == SAVEobj.saveName){
				// console.log("--__--SAVING2222222222222222222222--__--");
				storage[i].data = SAVEobj.data;
				localStorage.setItem(SAVEobj.saveName, storage);
				// console.log(localStorage.getItem(SAVEobj.saveName));
				return;
			}
		}
		// console.log("--__--SAVING3333333333333333333--__--");
		storage.push(SAVEobj);
		localStorage.setItem(SAVEobj.saveName, JSON.stringify(storage));
		return;
	}
	// console.log("--__--SAVING11111111111111111--__--");
	localStorage.setItem(SAVEobj.saveName, JSON.stringify([SAVEobj]));
	// console.log(SAVEobj.saveName + "=" + JSON.stringify(SAVEobj));
}



function LOAD(LOADobj){
	if(localStorage.getItem(LOADobj.saveName) != null && localStorage.getItem(LOADobj.saveName) != undefined){
		var storage = JSON.parse(localStorage.getItem(LOADobj.saveName));
		// console.log(storage);
		// console.log(LOADobj);
		for(let i = 0; i < storage.length; i++){
			// console.log(storage[i]);
			// console.log(storage[i].body + " == " + LOADobj.body + " && " + storage[i].saveName + " == " + LOADobj.saveName);
			if(JSON.stringify(storage[i].body) == JSON.stringify(LOADobj.body) && storage[i].saveName == LOADobj.saveName){
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
		location.reload();
	}
}



function nav(navObj){
	// navObj = {
	// 	'page': 'index',
	// 	'breadCrumb': 
	// 	{
	// 		'url': '/',
	// 		'nameDisplayed': 'Index'
	// 	}
	// };

	if(navObj.page == breadCrumbCurrent.page){
		// check if is already in the breadcrumbs
		var ifInTheList = false;
		for(let j = breadCrumbCurrent.breadCrumbs.length; j < i; j--){
			if(navObj.breadCrumb.url == breadCrumbCurrent.breadCrumbs[j].url
				&& navObj.breadCrumb.nameDisplayed == breadCrumbCurrent.breadCrumbs[j].nameDisplayed)
			{
				breadCrumbCurrent.breadCrumbs[j].active = true;
				ifInTheList = true;
				break;
			}
		}

		// edit breadcrumbs
		let nextsToRemove = false;
		for(let j = breadCrumbCurrent.breadCrumbs.length; j < i; j--){
			// set all active as false
			if(ifInTheList){
				if(navObj.breadCrumb.url != breadCrumbCurrent.breadCrumbs[j].url
					|| navObj.breadCrumb.nameDisplayed != breadCrumbCurrent.breadCrumbs[j].nameDisplayed)
				{
					breadCrumbCurrent.breadCrumbs[j].active = false;
				}
			// Remove all after activated, to add next of activated, to change the breadcrumbs
			} else {
				if(breadCrumbCurrent.breadCrumbs[j].active){
					nextsToRemove = true;
				}
				if(nextsToRemove){
					breadCrumbCurrent.breadCrumbs.splice(j, 1);
				}
			}
		}
		if(nextsToRemove){
			breadCrumbCurrent.breadCrumbs.push(navObj);
		}

		// Save actual breadcrumb inside breadcrumbs
		for(let i = 0; i < breadCrumbs.length; i++){
			if(breadCrumbs[i].page == navObj.page){
				breadCrumbs[i] = breadCrumbCurrent;
			}
		}
	}else{
		// check if new breadcrumb already exist in breadcrumbs
		var finded = false;
		for(i = 0; i < breadCrumbs.length; i++){
			if(breadCrumbs[i].page == navObj.page){
				breadCrumbCurrent = breadCrumbs[i];
				finded = true;
				break;
			}
		}
		// If not finded, add it
		if(!finded){
			breadCrumbs.push(
				{
					'page': navObj.page,
					'breadCrumbs': []
				}
			)
			breadCrumbCurrent = breadCrumbs[breadCrumbs.length - 1];
		}
	}
	console.log(breadCrumbs);
	console.log(breadCrumbCurrent);
	// Navigate to website
	window.location.replace(navObj.url);
}