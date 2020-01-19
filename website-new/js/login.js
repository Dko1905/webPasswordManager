function setupLoginForm(){
	document.getElementById('mainContainer').classList.add('d-none');
	$("#loginModal").modal()
	$('#loginForm').on('keyup', ()=>{
		let loginForm = document.getElementById('loginForm');
		if( loginForm.checkValidity() === true){
			$('#loginButton').prop('disabled', false);
		}
		else{
			$('#loginButton').prop("disabled",true);
		}
	})
}