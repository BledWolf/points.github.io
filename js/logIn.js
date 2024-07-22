var LogInConfirm = false;

window.onload = ()=>{

	document.getElementById("LogInBtn").addEventListener("click", ()=>{
		
		loadingSwitcher(true);
		new Promise((succes)=>{
			succes(googleAPI(
				"POST", 
				{
					"APIname": "login",
					"credentials":JSON.stringify({
						"email": document.getElementById("MailLogIn").value,
						"password": document.getElementById("PwdLogIn").value
					})
				}
			));
		}).then((res)=>{
			console.log(res);
			LogInConfirm = true;
			loadHBS("LogInConfirmHBS", "LogInConfirmHBSres", {
				LogInConfirm: LogInConfirm
			});

			document.getElementById("CloseMailLogInBtn").addEventListener("click", () => {
				loadHBS("LogInConfirmHBS", "LogInConfirmHBSres", {
					LogInConfirm: false
				});
			});

			document.getElementById("btnLogInConfirm").addEventListener("click", () => {
				new Promise((succes)=>{
					succes(googleAPI(
						"GET",{
							"APIname": "token/check",
							"credentials":JSON.stringify({
								"email": document.getElementById("MailLogIn").value,
								"password": document.getElementById("PwdLogIn").value,
								"token": document.getElementById("LogInConfirmText").value
							})
						}
					))
				}).then((res)=>{
					console.log(res);
					if(res == true){
						localStorage.setItem("token", document.getElementById("LogInConfirmText").value)
						window.location.href = "./index.html";
					}
				})
			});

		})
		.catch((err)=>{
			console.log(err);
		})
		.finally(()=>{
			loadingSwitcher(false);
		});
	});
};