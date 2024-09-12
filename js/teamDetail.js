let Team = [];

window.onload = () => {

	initShared();

	loadTeam();
}

function loadTeam(){
	loadingSwitcher(true);
	
	let idTeam = new URL(window.location).searchParams.get("id");

	new Promise((succes)=>{
		succes(googleAPI(
			"GET"
			, {
				"token": localStorage.getItem("token"),
				"APIname": "team/members",
				"idTeam": idTeam
			},
			"usersTeam",
			"team"
		))
	}).then((resTeam)=>{
		Team = resTeam[0];
		console.log(Team);
		loadHBS("teamHBS", "teamHBSres", {"team": Team});

		let elems = document.getElementsByClassName("ID_id");
		for(let i = 0; i < elems.length; i++){
			elems[i].style.visibility = "hidden";
			elems[i].innerHTML = "";
		}

		elems = document.getElementsByClassName("ID_userId");
		for(let i = 0; i < elems.length; i++){
			elems[i].style.visibility = "hidden";
			elems[i].innerHTML = "";
		}
		
		loadingSwitcher(false);
	})
}