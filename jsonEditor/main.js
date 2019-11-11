var json;

let code = (function(){
  return{
    encryptMessage: function(messageToencrypt = '', secretkey = ''){
      var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
      return encryptedMessage.toString();
    },
    decryptMessage: function(encryptedMessage = '', secretkey = ''){
      var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
      var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

      return decryptedMessage;
    }
  }
})();

function setPassword(){
	password = document.getElementById("password-box").value;
}

function setJson(){
	try{
		json = JSON.parse( document.getElementById("json-box").value );
	}
	catch(err) {
  	alert("Error : "+err);
		return;
	}
	console.log('succes to parse json');
}

function addAcount(website = '', email = '', password = '', extra = ''){
	account = {
		"website": website,
		"email": email,
		"password": password,
		"extra": extra
	};
	json.accounts.push(account);
	document.getElementById('json-box').value = JSON.stringify(json, null, '\t');
}

function addJson(){
	console.log("password");
	console.log(document.getElementById("website").value);
	console.log(document.getElementById("email").value);
	console.log(document.getElementById("password").value);
	console.log(document.getElementById("extra").value);
	addAcount(code.encryptMessage(document.getElementById("website").value, password), code.encryptMessage(document.getElementById("email").value, password), code.encryptMessage(document.getElementById("password").value, password), code.encryptMessage(document.getElementById("extra").value, password) );

}
