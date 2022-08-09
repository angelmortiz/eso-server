//***GLOBAL
const SERVER_ADDRESS = "http://localhost:3000/api";
let chronicConditions;

//TODO: Create generic methods that can be reused (DRY)
//FIXME: Implement a better async solution to fetch values
let getChronicConditions = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/chronicConditions`);
    chronicConditions = await response.json();
};
//*** [END] GLOBAL

/** SAFE FOR CONDITIONS **/
//elements
const btnSafeForConditions = document.querySelector('#btn-add-new-safe-condition');
const safeForCondtionsDiv = document.querySelector('#safeForConditions-selects');

async function addNewSafeConditionSelect() {
    //pulls conditions names and ids from server
    if (!chronicConditions) { await getChronicConditions(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    safeForCondtionsDiv.appendChild(selectNode);

    //adds options to the dropdown
    chronicConditions?.forEach(cc => {
        let option = new Option(cc.name, cc._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnSafeForConditions?.addEventListener('click', addNewSafeConditionSelect);
/** [END] SAFE FOR CONDITIONS **/

/** NOT RECOMMENDED FOR CONDITIONS **/
//elements
const btnNotRecommendedForConditions = document.querySelector('#btn-add-new-not-recommended-condition');
const notRecommendedForCondtionsDiv = document.querySelector('#notRecommendedForConditions-selects');

async function addNewNotRecommendedForConditionSelect() {
    //pulls conditions names and ids from server
    if (!chronicConditions) { await getChronicConditions(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    notRecommendedForCondtionsDiv.appendChild(selectNode);

    //adds options to the dropdown
    chronicConditions?.forEach(cc => {
        let option = new Option(cc.name, cc._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnNotRecommendedForConditions?.addEventListener('click', addNewNotRecommendedForConditionSelect);
/** [END] NOT RECOMMENDED CONDITIONS **/

/** DIET COMPATIBLE **/
//elements
const btnDietCompatible = document.querySelector('#btn-add-new-diet');
const dietCompatibleDiv = document.querySelector('#dietCompatible-selects');

//vars
let diets;

//FIXME: Implement a better async solution to fetch values
let getDiets = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/diets`);
    diets = await response.json();
};

async function addNewDietCompatibleSelect() {
    if (!diets) { await getDiets(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    dietCompatibleDiv.appendChild(selectNode);

    //adds options to the dropdown
    diets?.forEach(cc => {
        let option = new Option(cc.name, cc._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnDietCompatible?.addEventListener('click', addNewDietCompatibleSelect);
/** [END] DIET COMPATIBLE **/