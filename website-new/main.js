function show(elm,show = true){
	if(!show){
		elm.style.display = "none";
	}
	else{
		elm.style.display = "";
	}
	
}

function post(url = '', input = '', callback = (result = '')=>{}){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	xhr.send(input);
	xhr.onreadystatechange = () => {
		if(xhr.readyState != 4)
			return;
		if(xhr.status == 200){
			callback(xhr.responseText)
		}
	};

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


let url = 'https://daniel-password-server.herokuapp.com';

let token = {tokenString: '', experationDate: 0};
let hastoken = false;
let list = [];

function getToken(){
	let param = JSON.stringify({username:document.getElementById('username-box').value, password:document.getElementById('password-box').value});
	post(url+"/gettoken", param, (result)=>{
		let res = JSON.parse(result);
		if(res.error){
			alert('Error in getting token, username or password possibly wrong.');
			return;
		}
		token = res.token;
		hastoken = true;
		document.getElementById('loadButton').disabled = false;
		alert('Got the token.');
	});
}
function setData(data = ''){
	let param = JSON.stringify({tokenString:token.tokenString, experationDate:token.experationDate, data: data});
	post(url+"/setdata", param, (result)=>{
		let res = JSON.parse(result);
		if(res.error){
			alert(`Error in writing to file. (${res.errorMessage})`);
			return;
		}
	});
}
function getData(){
	let param = JSON.stringify({tokenString:token.tokenString, experationDate:token.experationDate});
	post(url+"/getdata", param, (result)=>{
		let res = JSON.parse(result);
		if(res.error){
			alert(`Error in reading from file. (${res.errorMessage})`);
			return;
		}
		list = JSON.parse( code.decryptMessage(res.data, document.getElementById('encryption-password-box').value));
		refreshList();
	});
}

function refreshList(){
	let table = document.getElementById('dataTable');
	while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
	list.forEach((value)=>{
		let tableRow = document.createElement('tr');

		let tdWebsite = document.createElement('td');
		let tdUsername = document.createElement('td');
		let tdPassword = document.createElement('td');
		let tdExtra = document.createElement('td');

		let inputWebsite = document.createElement('input');
		inputWebsite.value = value.website;
		let inputUsername = document.createElement('input');
		inputUsername.value = value.username;
		let inputPassword = document.createElement('input');
		inputPassword.value = value.password;
		let inputExtra = document.createElement('input');
		inputExtra.value = value.extra;

		tdWebsite.appendChild(inputWebsite);
		tdUsername.appendChild(inputUsername);
		tdPassword.appendChild(inputPassword);
		tdExtra.appendChild(inputExtra);

		tableRow.appendChild(tdWebsite);
		tableRow.appendChild(tdUsername);
		tableRow.appendChild(tdPassword);
		tableRow.appendChild(tdExtra);

		table.appendChild(tableRow);
	});
}

// on load hide dataDiv
show(document.getElementById('dataDiv'), false);

function onToken(){
	if(document.getElementById('username-box').value != '' && document.getElementById('password-box').value != ''){
		getToken();
	}
	else{
		alert('please type username and password.');
	}
}

function load(debug = false){
	if(!hastoken && !debug){
		alert('Please get a token.');
		return;
	}

	show(document.getElementById('loginDiv'), false);
	show(document.getElementById('dataDiv'), true);
	// TODO read from server and push to list
	{
		getData();
	}
}

function remove(){
	save();
	list.pop();
	refreshList();
}
function save(){
	let table = document.getElementById('dataTable');
	
	for(let i = 0; i < table.children.length; i++){
		let child = table.children.item(i);
		list[i] = {
			website: child.children.item(0).firstChild.value,
			username: child.children.item(1).firstChild.value,
			password: child.children.item(2).firstChild.value,
			extra: child.children.item(3).firstChild.value
		}
	}
}

function add(){
	save();
	list.push(
		{
			website:'',
			username:'',
			password:'',
			extra:''
		}
	)
	refreshList();
}
function push(){
	save();
	setData(code.encryptMessage(JSON.stringify(list), document.getElementById('encryption-password-box').value));
}