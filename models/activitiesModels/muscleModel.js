const muscles = [];

module.exports = class Muscle {
    id;
    name;
    alternativeName;
    type;
    linkToImage;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        muscles.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return muscles.find(f => f.name === name);
    }

    static fetchById(id) {
        return muscles.find(f => f.id === id);
    }

    static fetchAll() {
        return muscles;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return muscles.map(f => ({id: f.id, name: f.name}));
    }
};