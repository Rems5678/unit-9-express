const fs = require('fs');
const path = require('path');

const fileController = {};

fileController.getCharacters = (req, res, next) => {
  const { results } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/characters.json'), 'UTF-8'));
  if (!results) {
    return next({
      log: 'fileController.getCharacters: ERROR: Error getting characters data from characters.json file',
      message: { err: 'Error occurred in fileController.getCharacters. Check server logs for more details.' },
    });
  }
  res.locals.characters = results;
  next();
};

// ADD MIDDLEWARE TO GET FAVORITE CHARACTERS HERE
fileController.getFavs = (req, res, next) => {
  const results = fs.readFileSync(path.resolve(__dirname, '../data/favs.json'))
  const jsonResults = JSON.parse(results);
  if (typeof results !== 'object') {
    return next({
      log: `fileController.getFavs: ERROR: /* the error from the file system */`,
      message: { err: 'fileController.getFavs: ERROR: Check server logs for details' },
    })
  }
  res.locals.favs = jsonResults;
  return next();
}

// ADD MIDDLEWARE TO ADD A FAVORITE CHARACTER HERE
fileController.addFav = (req, res, next) => {
  console.log(res.locals.favs);
  if (typeof res.locals.favs !== 'object') {
    return next({
      log: 'fileController.addFavs: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.addFavs: ERROR: Check server logs for details' },
    })
  }
  const id = req.params.id;
  if (res.locals.favs[id]) {
    return next();
  }
  res.locals.favs[id] = true;
  console.log(res.locals);
  fs.writeFileSync(path.join(__dirname, '../data/favs.json'), JSON.stringify(res.locals.favs), (err) => {
    if (err) {
      return next({
        log: `fileController.addFav: ERROR: /* the error from the file system / other calls */`,
        message: { err: 'fileController.addFav: ERROR: Check server logs for details' },
      })
    }
  });
  return next();
}

// ADD MIDDLEWARE TO REMOVE A CHARACTER FROM FAVORITES HERE
fileController.removeFav = (req, res, next) => {
  if (typeof res.locals.favs !== 'object') {
    return next({
      log: 'fileController.removeFav: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.removeFav: ERROR: Check server logs for details' },
    })
  }
}

// Extention 1: ADD MIDDLEWARE TO GET CHARACTER NICKNAMES HERE


// Extention 1: ADD MIDDLEWARE TO SET A CHARACTER'S NICKNAME HERE


// Extention 1: ADD MIDDLEWARE TO REMOVE A CHARACTER'S NICKNAME HERE


module.exports = fileController;
