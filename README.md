# Zaawansowane programowanie w języku JavaScript
Projekt na zaliczenie przedmiotu, Krystian Wasiuk nr. albumu 46362.
Jest to proste API sklepu robione według wzoru z zajęć

## Spis treści
* [Technologie](#technologie)
* [Instalacja](#instalacja)
* [Połączenie z bazą danych](#połączenie-z-bazą-danych)
* [Serwer](#serwer)
* [Autentykacja](#autentykacja)
* [Kontrolery](#kontrolery)
* [Użytkownicy](#użytkownicy)
* [Produkty](#produkty)
* [Szyfrowanie](#szyfrowanie)
* [Status](#status)

## Technologie
Do sprawdzenia poprawności działania serwera wykorzystywano program Postman
Projekt wykorzystuje
* JavaScript
* mongoDB wersja: 4.2.11
* Node.js wersja: 14.10.1 
* [express](https://www.npmjs.com/package/express) wersja: 6.14.8
* [morgan](https://www.npmjs.com/package/morgan) wersja: 1.10.0
* [mongoose](https://www.npmjs.com/package/mongoose) wersja: 5.11.10
* [body-parser](https://www.npmjs.com/package/body-parser) wersja: 1.19.0
* [nodemon](https://www.npmjs.com/package/nodemon?activeTab=readme) wersja: 2.0.6
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) wersja: 8.5.1
* [bcrypt](https://www.npmjs.com/package/bcrypt) wersja: 5.0.0
* [multer](https://www.npmjs.com/package/multer) wersja: 1.4.2

	
## Instalacja
Do włączenia projektu lokalnie należy zainstalować npm z poziomu konsoli:
```
npm install
```
Instalacja ww. technologii:
```
npm i --save express
npm i --save morgan
npm i --save multer
npm i --save mongoose
npm i --save nodemon
npm i --save bcrypt
npm i --save jsonwebtoken
npm i --save body-parser
```

## Połączenie z bazą danych
Połączenie umieszczone jest w pliku _app.js_
```
mongoose.connect(
  'mongodb+srv://user:' +
    process.env.ATLAS_PWD +
    '@mbo.ns57q.mongodb.net/sklep?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
```
``` process.env.ATLAS_PWD ``` umieszczone jest w pliku _nodemon.json_

## Serwer
Port ustawiony na 3000
``` const port = process.env.port || 3000; ```
Stworzenie serwera komendą
``` const server = http.createServer(app); ```
Uruchomienie serwera: 
``` const server = http.createServer(app); ```

## Autentykacja
W pliku _check-auth.js_ znajduje się funkcja odpowiedzialna za autentykację użytkownika:
``` 
module.exports = (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
    next();
  } catch (err) {
    res.status(401).json({ wiadomość: 'Błąd autoryzacji' });
  }
};
```

## Kontrolery
W pliku _controllers/products.js_ znajdują się definicje funkcji dla produktów, poprawia to czytelność kodu oraz ułatwia edycję produktów. Przykładowy kontroler zwracający listę produktów:
```
exports.get_all_products = (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        wiadomosc: 'Lista wszystkich produktów',
        szczegoly: docs,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};
```


## Użytkownicy
W pliku _users.js_ importowany jest model użytkownika ``` const User = require('../models/user'); ```, aby za jego pomocą można było się logować: 
```router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ wiadomość: 'Błąd autoryzacji' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            res.status(200).json({
              wiadomość: 'Zalogowano', 
              token: token
            });
          } else {
            res.status(401).json({ wiadomość: 'Błąd autoryzacji' });
          }
        })
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => res.status(500).json({ error: err }));
});
```
, dodawać konto:
```
router.post('/signup', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(409).json({ wiadomość: 'Użytkownik już istnieje' });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((doc) => {
                res.status(201).json({
                  wiadomość: 'Utworzono nowego użytkownika',
                  szczegóły: doc,
                });
              })
              .catch((err) => res.status(500).json({ error: err }));
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});
```
, oraz usuwać konto:
```
router.delete('/:userId', (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then(() => {
      res.status(200).json({ wiadomość: 'Użytkownik został usunięty' });
    })
    .catch((err) => res.status(500).json({ error: err }));
});
```

## Produkty
Model produktu znajduje się w _models/products.js_ :
```
const productSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
});
```
funkcje wykorzystujące ten model znajdują się w _routes/products.js_ a ich definicje w [kontrolerach](#kontrolery).

## Szyfrowanie 
Szyfrowanie hasła wykorzystane jest w pliku _routes/user.js_, definiowane w linijce: `const bcrypt = require('bcrypt');`
Samo szyfrowanie odbywa się w funkcji `bcrypt.hash(req.body.password, 10, (err, hash) => {`, a przy logowaniu: `bcrypt
        .compare(req.body.password, user.password)
        .then((result) =>`.

## Status
Projekt jest na ten moment skończony i gotowy do użycia
