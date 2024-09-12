var LogInConfirm = false;

function logIn(){
	loadingSwitcher(true);
	new Promise((succes)=>{
		succes(googleAPI(
			"POST", 
			{
				"APIname": "login",
				"email": document.getElementById("MailLogIn").value,
				"password": document.getElementById("PwdLogIn").value
			}
		));
	}).then((res)=>{
		console.log(res);
		LogInConfirm = true;
		loadHBS("LogInConfirmHBS", "LogInConfirmHBSres", {
			LogInConfirm: LogInConfirm
		});

	})
	.catch((err)=>{
		console.log(err);
	})
	.finally(()=>{
		loadingSwitcher(false);
	});
}

function confirmLogIn(){
	new Promise((succes)=>{
		succes(googleAPI(
			"GET",
			{
				"APIname": "login/confirm",
				"email": document.getElementById("MailLogIn").value,
				"password": document.getElementById("PwdLogIn").value,
				"token": document.getElementById("LogInConfirmText").value
			}
		));
	}).then((res)=>{
		console.log("42_", res);
		if(res == true){
			localStorage.setItem("token", document.getElementById("LogInConfirmText").value)
			window.location.href = "./index.html";
		}
	});
}

function close(){
	loadHBS("LogInConfirmHBS", "LogInConfirmHBSres", {
		LogInConfirm: false
	});
}