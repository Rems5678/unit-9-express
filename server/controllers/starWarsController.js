const fetch = require('node-fetch');

const { convertToPhotoUrl } = require('../utils/helpers');

const starWarsController = {};

// ADD MIDDLEWARE TO GET MORE CHARACTERS HERE
starWarsController.getMoreCharacters = (req, res, next) => {
  fetch('https://swapi.co/api/people/?page=3')
  .then(res => res.json())
  .then(data  => {
    const {results} = data;
    if (res.locals.newCharacters === undefined) {
      res.locals.newCharacters = results;
    }
    else {
      res.locals.newCharacters.concat(results);
    }
    console.log(data)
    next()})
  .catch( err => {
    return next({
      log: `Error starWarsController.getMoreCharacters ${err}`,
      message: {err: 'starWarsController.getMoreCharacters: ERROR: Check server logs for details'}
    })
  })
}

// ADD MIDDLEWARE TO ADD CHARACTER PHOTOS HERE
starWarsController.populateCharacterPhotos = (req, res, next) => {
  const {newCharacters} = res.locals;
  if (newCharacters === undefined) {
    return next({
      log: 'starWarsController.populateCharacterPhotos: Error res.locals.newCharacters is undefined',
      message: {err: 'starWarsController.starWarsController: ERROR: Check server logs for details'}
    })
  }

  for (let i = 0; i < newCharacters.length; i++) {
    const elem = newCharacters[i];
    elem.photo = convertToPhotoUrl(elem.name);
  }
  return next();
}

// ADD REQUEST CHARACTER VALIDATION MIDDLEWARE HERE
starWarsController.validateRequestCharacter = (req, res, next) => {
  if (!req.body.character || !req.body.character.homeworld || !req.body.character.films) {
    return next({
      log: 'starWarsController.validateRequestCharacter: ERROR: expected /* insert missing property here */ to exist',
      message: { err: 'server POST /details: ERROR: Invalid request body' },
    })
  }
  return next();
}

// ADD GET HOMEWORLD MIDDLEWARE HERE

starWarsController.getHomeworld = (req, res, next) => {
  fetch(req.body.character.homeworld)
  .then(res => res.json())
  .then(data => {
    res.locals.homeworld = data;
    return next();
  })
  .catch(err => {
    return next({
      log: `starWarsController.getHomeworld: ERROR: /* the error from the star wars api */`,
      message: { err: 'starWarsController.getHomeworld: ERROR: Check server logs for details' },
    })
  })
}

// ADD GET FILMS MIDDLEWARE HERE
starWarsController.getFilms = (req, res, next) => {
  const promises = req.body.character.films.map(url => {
    console.log(url);
    return fetch(url).then(res => res.json());
  })
  Promise.all(promises)
  .then(data => {
    console.log(data);
    res.locals.films = data;
    next();
  })
  .catch(err => {
    console.log('an error occurred');
    return next({
      log: `starWarsController.getFilms: ERROR: /* the error from the star wars api */`,
      message: { err: 'starWarsController.getFilms: ERROR: Check server logs for details' },
    })
  })
}

module.exports = starWarsController;
