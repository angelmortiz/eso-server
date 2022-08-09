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
btnSafeForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addNewSafeConditionSelect();
});

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
btnNotRecommendedForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addNewNotRecommendedForConditionSelect();
});
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
    diets?.forEach(d => {
        let option = new Option(d.name, d._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnDietCompatible?.addEventListener('click', (event) => { 
    event.preventDefault();
    addNewDietCompatibleSelect()}
);
/** [END] DIET COMPATIBLE **/

/** MENSTRUAL PHASES **/
//elements
const btnMenstrualCyclePhase = document.querySelector('#btn-add-new-phase');
const menstrualCyclePhaseDiv = document.querySelector('#menstrualCyclePhases-selects');

//vars
let phases;

//FIXME: Implement a better async solution to fetch values
let getPhases = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/menstrualCyclePhases`);
    phases = await response.json();
};

async function addNewDCyclePhaseSelect() {
    if (!phases) { await getPhases(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    menstrualCyclePhaseDiv.appendChild(selectNode);

    //adds options to the dropdown
    phases?.forEach(mcp => {
        let option = new Option(mcp, mcp);
        selectNode.appendChild(option);
    });
};

//listeners
btnMenstrualCyclePhase?.addEventListener('click', (event) => { 
    event.preventDefault();
    addNewDCyclePhaseSelect()
});
/** [END] MENSTRUAL PHASES **/