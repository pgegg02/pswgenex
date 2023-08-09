// Function to generate a random password
function generatePassword() {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var password = "";
  for (var i = 0; i < 16; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}

// Function to display and save the generated password
function saveAndDisplayPassword() {
  var passwordElement = document.getElementById("password");
  var generatedPassword = generatePassword();
  var site =prompt("Für welche Website ist das Passwort?");
  if (site) {
    passwordElement.textContent = generatedPassword;
    savePassword(site, generatedPassword);
    copyToClipboard(generatedPassword);
  }
}

// Function to save the password in local chrome storage
function savePassword(site, password) {
  chrome.storage.local.get({ passwords: [] }, function(data) {
    const passwords = data.passwords;
    passwords.push({ site, password });
    chrome.storage.local.set({ passwords: passwords });
  });
}

// Function to copy ptext in password div to the clipboard
function copyToClipboard(text) {
  var dummyInput = document.createElement("input");
  document.body.appendChild(dummyInput);
  dummyInput.setAttribute("value", text);
  dummyInput.select();
  document.execCommand("copy");
  document.body.removeChild(dummyInput);
}

// Function to generate text (for the download function)
function generateDownloadText(passwords) {
  var content = "Site, Password\n";
  passwords.forEach(passwordObj => {
    content += `${passwordObj.site},${passwordObj.password}\n`;
  });
  return content;
}

// Function to download the, with generateDownloadText made content
function downloadPasswords() {
  chrome.storage.local.get({ passwords: [] }, function(data) {
    const passwords = data.passwords;
    const content = generateDownloadText(passwords);
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Event listener for download button 
document.getElementById('download').addEventListener('click', downloadPasswords);

// Event listener for generate button 
document.getElementById("generate").addEventListener("click", function(event) {
  event.preventDefault();
  saveAndDisplayPassword();
});
