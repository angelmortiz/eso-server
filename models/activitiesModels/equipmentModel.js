const equipments = [];

module.exports = class Equipment  {
    id;
    name;
    alternativeName;
    description;
    exercises;
    linkToImage;

    constructor(inputValues) {
        if (!inputValues) return; //if no values were provided, ignore the rest of the logic
        this.mapValues(inputValues);
    }

    save() {
        equipments.push(this);
    }

    mapValues(inputValues){
        Object.keys(inputValues).map(key => this[key] = inputValues[key]);
    }

    static fetchByName(name) {
        return equipments.find(f => f.name === name);
    }

    static fetchById(id) {
        return equipments.find(f => f.id === id);
    }

    static fetchAll() {
        return equipments;
    }

    //extracts id and name properties and creates a new object with {id, name}
    static fetchAllNames()  {
        return equipments.map(f => ({id: f.id, name: f.name}));
    }
};