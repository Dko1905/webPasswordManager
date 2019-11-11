const url = "https://cors-anywhere.herokuapp.com/https://pastebin.com/raw/t3yVBeC7";
var password;

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
	password =  document.getElementById("password-box").value;
}

function createTableFromInfo(data){
	let table = document.getElementById("table");

	let accounts = data["accounts"];

	accounts.forEach((account)=>{
		let row = document.createElement("tr");

		var infoCells = [document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td")];

		infoCells[0].appendChild( document.createTextNode(code.decryptMessage(account["website"], password)) );
		infoCells[1].appendChild( document.createTextNode(code.decryptMessage(account["email"], password)) );
		infoCells[2].appendChild( document.createTextNode(code.decryptMessage(account["password"], password)) );
		infoCells[3].appendChild( document.createTextNode(code.decryptMessage(account["extra"], password)) );

		infoCells.forEach((element)=>{
			row.appendChild(element);
		})
		table.appendChild(row);
	})
}
var el;
function loadPasswords(){
	/*$.get(url, function(response) { 
		var el = document.createElement( 'html' );
		el.innerHTML = response;

		console.log(el.getElementsByTagName( 'pre' )[0]); // Live NodeList of your anchor elements

	});*/
	setPassword();
	console.log("Starting to fetch.");
	fetch(url, {
		headers: {
			"Access-Control-Allow-Origin": '*',
			"Access-Control-Allow-Methods": 'get',
		}
	})
		.then(response => response.text())
		.then(text => {
			console.log("Ended fetch.");
			el = document.createElement( 'html' );
			el.innerHTML = text;
			let json = JSON.parse(el.getElementsByTagName( 'body' )[0].innerHTML);
			createTableFromInfo(json);
		});
}
