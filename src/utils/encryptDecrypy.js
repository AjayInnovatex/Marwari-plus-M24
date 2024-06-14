const key = "my-secret-key";

export function encrypt(text) {
  let encrypted = "";
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(encrypted); // Base64 encode to handle binary data in storage
}

export function decrypt(encryptedText) {
  let decrypted = "";
  encryptedText = atob(encryptedText); // Base64 decode
  for (let i = 0; i < encryptedText.length; i++) {
    decrypted += String.fromCharCode(
      encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return decrypted;
}
