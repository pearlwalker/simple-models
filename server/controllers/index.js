const models = require('../models');

const { Cat } = models;
const { Dog } = models;

const hostIndex = async (req, res) => {
  let name = 'unknown';

  try {
    const doc = await Cat.findOne({}, {}, {
      sort: { createdDate: 'descending' },
    }).lean().exec();

    if (doc) {
      name = doc.name;
    }
  } catch (err) {
    console.log(err);
  }

  res.render('index', {
    currentName: name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();

    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  res.render('page4');
};

const getName = async (req, res) => {
  try {
    const doc = await Cat.findOne({}).sort({ createdDate: 'descending' }).lean().exec();

    if (doc) {
      return res.json({ name: doc.name });
    }
    return res.status(404).json({ error: 'No cat found' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong contacting the database' });
  }
};

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);
  try {
    await newCat.save();
    return res.status(201).json({
      name: newCat.name,
      beds: newCat.bedsOwned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' });
  }
};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  let doc;
  try {
    doc = await Cat.findOne({ name: req.query.name }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'No cats found' });
  }

  return res.json({ name: doc.name, beds: doc.bedsOwned });
};

const updateLast = (req, res) => {
  const updatePromise = Cat.findOneAndUpdate({}, { $inc: { bedsOwned: 1 } }, {
    returnDocument: 'after',
    sort: { createdDate: 'descending' },
  }).lean().exec();

  updatePromise.then((doc) => res.json({
    name: doc.name,
    beds: doc.bedsOwned,
  }));

  updatePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });
};
const createDog = async (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'Name, Breed, and Age are all required' });
  }
  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);
  try {
    await newDog.save();
    return res.status(201).json({
      name: newDog.name,
      breed: newDog.breed,
      age: newDog.age,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to create dog' });
  }
};

const ageDog = async (req, res) => {
  console.log(req, res);
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
  ageDog,
  createDog,
};
