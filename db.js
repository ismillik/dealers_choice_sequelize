const Sequelize = require('sequelize');
const { DataTypes: { STRING, UUID, UUIDV4 } } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize');

const composers = [
    'Hans Zimmer',
    'Philip Glass',
    'Johan Johannsson',
    'Jonny Greenwood',
    'Alexandre Desplat',
    'John Williams'
];

const directors = [
    'Rob Minkoff',
    // 'Roger Allers',
    'Christopher Nolan',
    'Godfrey Reggio',
    'Stephen Daldry',
    'Peter Weir',
    'Denis Villeneuve',
    'Panos Cosmatos',
    'Paul Thomas Anderson',
    'Guillermo del Toro',
    'Wes Anderson',
    'Steven Spielberg',
    'George Lucas'
];

const films = [
    'The Lion King', 
    'Inception', 
    'Interstellar',
    'Koyaanisqatsi', 
    'The Hours', 
    'The Truman Show',
    'Arrival', 
    'Sicario', 
    'Mandy',
    'Phantom Thread', 
    'There Will Be Blood', 
    'Junun',
    'The Shape of Water', 
    'The Grand Budapest Hotel', 
    'Isle of Dogs',
    'Schindler\'s List', 
    'Star Wars', 
    'Jaws'
];

const Composer = conn.define ('composer', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const Director = conn.define ('director', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const Film = conn.define ('film', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    title: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

Film.belongsTo(Composer);
Composer.hasMany(Film);

Film.belongsTo(Director);
Director.hasMany(Film);

Composer.prototype.findFilms = function(){
    return Film.findAll({
      where: {
        composerId: this.id
      },
      include: { 
          model: Director, as: 'director'
        }
    });
  }



const syncAndSeed = async () => {
    await conn.sync({force: true});
    const [
        hansZimmer,
        philipGlass,
        johanJohannsson,
        jonnyGreenwood,
        alexandreDesplat,
        johnWilliams
    ] = await Promise.all(composers.map((name)=> Composer.create({ name }))); 
    const [
        robMinkoff,
        // rogerAllers,
        christopherNolan,
        godfreyReggio,
        stephenDaldry,
        peterWeir,
        denisVilleneuve,
        panosCosmatos,
        paulThomasAnderson,
        guillermoDelToro,
        wesAnderson,
        stevenSpielberg,
        georgeLucas
    ] = await Promise.all(directors.map((name)=> Director.create({ name })));
    const [
        theLionKing, 
        inception, 
        interstellar,
        koyaanisqatsi, 
        theHours, 
        theTrumanShow,
        arrival, 
        sicario, 
        mandy,
        phantomThread, 
        thereWillBeBlood, 
        junun,
        theShapeofWater, 
        theGrandBudapestHotel, 
        isleofDogs,
        schindlersList, 
        starWars, 
        jaws
    ] = await Promise.all(films.map((title) => Film.create({ title })));
    
    theLionKing.composerId = hansZimmer.id;
    inception.composerId = hansZimmer.id;
    interstellar.composerId = hansZimmer.id;
    koyaanisqatsi.composerId = philipGlass.id;
    theHours.composerId = philipGlass.id;
    theTrumanShow.composerId = philipGlass.id;
    arrival.composerId = johanJohannsson.id;
    sicario.composerId = johanJohannsson.id;
    mandy.composerId = johanJohannsson.id;
    phantomThread.composerId = jonnyGreenwood.id;
    thereWillBeBlood.composerId = jonnyGreenwood.id;
    junun.composerId = jonnyGreenwood.id;
    theShapeofWater.composerId = alexandreDesplat.id;
    theGrandBudapestHotel.composerId = alexandreDesplat.id;
    isleofDogs.composerId = alexandreDesplat.id;
    schindlersList.composerId = johnWilliams.id;
    starWars.composerId = johnWilliams.id;
    jaws.composerId = johnWilliams.id;

    theLionKing.directorId = robMinkoff.id;
    inception.directorId = christopherNolan.id;
    interstellar.directorId = christopherNolan.id;
    koyaanisqatsi.directorId = godfreyReggio.id;
    theHours.directorId = stephenDaldry.id;
    theTrumanShow.directorId = peterWeir.id;
    arrival.directorId = denisVilleneuve.id;
    sicario.directorId = denisVilleneuve.id;
    mandy.directorId = panosCosmatos.id;
    phantomThread.directorId = paulThomasAnderson.id;
    thereWillBeBlood.directorId = paulThomasAnderson.id;
    junun.directorId = paulThomasAnderson.id;
    theShapeofWater.directorId = guillermoDelToro.id;
    theGrandBudapestHotel.directorId = wesAnderson.id;
    isleofDogs.directorId = wesAnderson.id;
    schindlersList.directorId = stevenSpielberg.id;
    starWars.directorId = georgeLucas.id;
    jaws.directorId = stevenSpielberg.id;

    await Promise.all([ 
        theLionKing.save(), 
        inception.save(), 
        interstellar.save(),
        koyaanisqatsi.save(), 
        theHours.save(), 
        theTrumanShow.save(),
        arrival.save(), 
        sicario.save(), 
        mandy.save(),
        phantomThread.save(), 
        thereWillBeBlood.save(), 
        junun.save(),
        theShapeofWater.save(), 
        theGrandBudapestHotel.save(), 
        isleofDogs.save(),
        schindlersList.save(), 
        starWars.save(), 
        jaws.save()
    ]);
};

module.exports = {
    syncAndSeed,
    models: {
        Composer,
        Director,
        Film
    }
}