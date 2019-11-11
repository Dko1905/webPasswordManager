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
	password = document.getElementById("password-box").value;
}

function encrypt(){
	var input = document.getElementById("input-box").value;

	document.getElementById("output-box").value = code.encryptMessage(input, password);
}

function decrypt(){
	var input = document.getElementById("input-box").value;

	document.getElementById("output-box").value = code.decryptMessage(input, password);
}
