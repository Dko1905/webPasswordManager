class Token {
	constructor(token, expirationDate) {
		this.token = token || '';
		this.expirationDate = expirationDate || 0;
	}
}
class Account {
	constructor(username, password) {
		this.username = username;
		this.password = password;
	}
}

class ResponseTokenMessage {
	constructor(token, error) {
		this.token = token;
		this.error = error;
	}
}
class ResponseMessage {
	constructor(type, rtm, rdm) {
		this.type = type;
		this.rtm = rtm || new ResponseTokenMessage(new Token(), false);
		this.rdm = rdm || new ResponseDataMessage('', false);
	}
}
class ResponseDataMessage {
	constructor(data, error) {
		this.data = data;
		this.error = error;
	}
}

class RequestTokenMessage {
	constructor(account) {
		this.account = account;
	}
}
class RequestMessage {
	constructor(type, rtm, rdm, rem) {
		this.type = type;
		this.rtm = rtm || new RequestTokenMessage(new Account('', ''));
		this.rdm = rdm || new RequestDataMessage(new Token());
		this.rem = rem || new RequestEditMessage('', new Token());
	}
}
class RequestDataMessage {
	constructor(token) {
		this.token = token;
	}
}
class RequestEditMessage {
	constructor(data, token) {
		this.data = data;
		this.token = token;
	}
}

let code = (function () {
	return {
		encryptMessage: function (messageToencrypt = '', secretkey = '') {
			var encryptedMessage = CryptoJS.AES.encrypt(messageToencrypt, secretkey);
			return encryptedMessage.toString();
		},
		decryptMessage: function (encryptedMessage = '', secretkey = '') {
			var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);
			var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);

			return decryptedMessage;
		}
	}
})();

const url = 'https://cors-proxy-daniel.herokuapp.com/';
var token;
function setToken() {
	let username = document.getElementById('username-box').value;
	let password = document.getElementById('password-box').value;
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	xhr.send(JSON.stringify(new RequestMessage('gettoken', new RequestTokenMessage(new Account(username, password)))));
	xhr.onreadystatechange = () => {
		if (xhr.readyState != 4)
			return;
		if (xhr.status == 200) {
			
			var data = JSON.parse(xhr.responseText);
			if (!data.rtm.error) {
				token = data.rtm.token;
				console.log('Done getting token');
			}
			else{
				console.log('Username or password is not correct.');
			}
		}
	};
}
function getData(callback) {
	let req =  new RequestMessage('getdata', undefined, new RequestDataMessage(token));
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	xhr.send(JSON.stringify(req));
	xhr.onreadystatechange = () => {
		if (xhr.readyState != 4)
			return;
		if (xhr.status == 200) {
			
			var data = JSON.parse(xhr.responseText);
			if (!data.rdm.error) {
				if(callback){
					callback(false, data.rdm.data);
				}
				else{
					console.log(callback);
				}
			}
			else{
				console.log('Token is invalid.');
			}
		}
	};
}

function createTableFromInfo(data, password){
	console.log(data);
	let table = document.getElementById("table");

	let accounts = data["accounts"];

	accounts.forEach((account)=>{
		let row = document.createElement("tr");

		var infoCells = [document.createElement("td"), document.createElement("td"), document.createElement("td"), document.createElement("td")];

		infoCells[0].appendChild( (()=>{let temp = document.createElement('input'); temp.value = code.decryptMessage(account["website"], password); return temp})() );
		infoCells[1].appendChild( (()=>{let temp = document.createElement('input'); temp.value = code.decryptMessage(account["email"], password); return temp})() );
		infoCells[2].appendChild( (()=>{let temp = document.createElement('input'); temp.value = code.decryptMessage(account["password"], password); return temp})() );
		infoCells[3].appendChild( (()=>{let temp = document.createElement('input'); temp.value = code.decryptMessage(account["extra"], password); return temp})() );

		infoCells.forEach((element)=>{
			row.appendChild(element);
		})
		table.appendChild(row);
	})
}

function dumpPasswords(){
	let result = new Array(); // array of PasswordAccount objects.
	let table = document.getElementById("table");
	const password = document.getElementById("encryption-password-box").value;

	for(let i = 1; i < table.children.length; i++){
		let tableRow = table.children[i];
		let passAccount = {"website": code.encryptMessage(tableRow.children[0].children[0].value, password), "email":code.encryptMessage(tableRow.children[1].children[0].value, password), "password":code.encryptMessage(tableRow.children[2].children[0].value, password), "extra":code.encryptMessage(tableRow.children[3].children[0].value, password)};
		result.push(passAccount);
	}
	return result;
}

function savePasswords(){
	let passwords = {'accounts':dumpPasswords()};
	console.log(passwords);
	let req = new RequestMessage('setedit', undefined, undefined, new RequestEditMessage(JSON.stringify(passwords), token));
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	let toSend = JSON.stringify(req);
	xhr.send(toSend);
}

function loadPasswords() {
	let func = (err, data)=>{
		if(!err){
			createTableFromInfo(JSON.parse(data), document.getElementById('encryption-password-box').value);
		}
	};
	getData(func);
	
}
console.log('hello world');
