var admin = require("firebase-admin");
var serviceAccount = require("./hizmet_anahtari.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  //databaseURL kısmına Firestore "Settings/Hizmet Hesapları" panelinde yer Admin SDK yapılandırma snippet'ındaki databaseURL'i yazın
  databaseURL: "https://uygulamaadi.firebaseio.com"
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "dosyalar");

fs.readdir(directoryPath, function(err, dosyalar) {
  if (err) {
    return console.log("Dizin taranamıyor: " + err);
  }

  dosyalar.forEach(function(file) {
    var lastDotIndex = file.lastIndexOf(".");
// JSON formatındaki dosyalrınızı "dosyalar" klasörü altında barındırın
    var menu = require("./dosyalar/" + file);

    menu.forEach(function(obj) {
      firestore
        .collection(file.substring(0, lastDotIndex))
        .doc(obj.belgeID)
        .set(obj)
        .then(function(docRef) {
          console.log("Belge Başarıyla Firestore'a Eklendi ");
        })
        .catch(function(error) {
          console.error("Bir hata mevcut: ", error);
        });
    });
  });
});
