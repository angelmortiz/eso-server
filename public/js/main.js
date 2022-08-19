//***GLOBAL
const SERVER_ADDRESS = "http://localhost:3000/api";

//********* Add New [Buttons] */
//SELECT
let addSelectToDiv = async (selectOptions, getOptionsFunc, selectName, divNode) => {
    //gets options from server
    if (!selectOptions) { 
        selectOptions = await getOptionsFunc();
    }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    selectNode.name = selectName;
    divNode.appendChild(selectNode);

    //adds options to the dropdown
    selectOptions?.forEach(selectOpt => {
        let option = new Option(selectOpt.name, selectOpt._id);
        selectNode.appendChild(option);
    });
}

//********* DELETE ACTIONS */
let showDeleteConfirmation = (typeDisplay, name) => {
    return confirm(`¿Seguro que deseas borrar el/la ${typeDisplay} '${name}'?`);
}

let sendDeleteCommand = async (database, type, id) => {
     const response = await fetch(`${SERVER_ADDRESS}/${database}/${type}/${id}`, {method: 'DELETE'});
     window.location.href = response.url;
};

let deleteDocument = async (documentInfo) => {
    const isConfirmed = showDeleteConfirmation(documentInfo.typeDisplay, documentInfo.name);
    if (!isConfirmed) return;
    
    await sendDeleteCommand(documentInfo.database, documentInfo.type, documentInfo.id);
};
//*** [END] GLOBAL

/** SAFE FOR CONDITIONS **/
//elements
const btnSafeForConditions = document.getElementById('btn-add-new-safe-condition');
const safeForCondtionsDiv = document.getElementById('safeForConditions-selects');

let chronicConditions;
let getChronicConditions = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/chronicConditions`);
    chronicConditions = await response.json();
    return chronicConditions
};

//listeners
btnSafeForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(chronicConditions, getChronicConditions, "safeForConditions", safeForCondtionsDiv);
});
/** [END] SAFE FOR CONDITIONS **/

/** NOT RECOMMENDED FOR CONDITIONS **/
//elements
const btnNotRecommendedForConditions = document.getElementById('btn-add-new-not-recommended-condition');
const notRecommendedForCondtionsDiv = document.getElementById('notRecommendedForConditions-selects');

//listeners
btnNotRecommendedForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(chronicConditions, getChronicConditions, "notRecommendedForConditions", notRecommendedForCondtionsDiv);
});
/** [END] NOT RECOMMENDED CONDITIONS **/

/** DIET COMPATIBLE **/
//elements
const btnCompatibleWithDiets = document.getElementById('btn-add-new-diet');
const compatibleWithDietsDiv = document.getElementById('compatibleWithDiets-selects');

//vars
let diets;
let getDiets = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/diets`);
    diets = await response.json();
    return diets;
};

//listeners
btnCompatibleWithDiets?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(diets, getDiets, "compatibleWithDiets", compatibleWithDietsDiv);
});
/** [END] DIET COMPATIBLE **/

/** MENSTRUAL PHASES **/
//elements
const btnMenstrualCyclePhase = document.getElementById('btn-add-new-phase');
const menstrualCyclePhaseDiv = document.getElementById('menstrualCyclePhases-selects');

//vars
let phases;
let getPhases = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/menstrualCyclePhases`);
    phases = await response.json();
    return phases;
};

//listeners
btnMenstrualCyclePhase?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(phases, getPhases, "recommendedForCyclePhases", menstrualCyclePhaseDiv);
});
/** [END] MENSTRUAL PHASES **/

/** FOOD **/
//********* Delete [Button] */
//elements
const btnDeleteFood = document.getElementById('btn-delete-food');
const selectedFood = document.getElementById('select-food-selection');
const selectedFoodName = selectedFood?.options[selectedFood.selectedIndex].text;
const selectedFoodId = selectedFood?.options[selectedFood.selectedIndex].value;
const foodInfo = {
    database: 'nutrition',
    type: 'food',
    typeDisplay: 'comida',
    name: selectedFoodName,
    id: selectedFoodId
};

//listeners
btnDeleteFood?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(foodInfo);
});
/** [END] FOOD **/

/** CHRONIC CONDITION **/
//********* Delete [Button] */
//elements
const btnDeleteChronicCondition = document.getElementById('btn-delete-chronicCondition');
const selectedChronicCondition = document.getElementById('select-chronicCondition-selection');
const selectedChronicConditionName = selectedChronicCondition?.options[selectedChronicCondition.selectedIndex].text;
const selectedChronicConditionId = selectedChronicCondition?.options[selectedChronicCondition.selectedIndex].value;
const chronicConditionInfo = {
    database: 'nutrition',
    type: 'chronicCondition',
    typeDisplay: 'condición crónica',
    name: selectedChronicConditionName,
    id: selectedChronicConditionId
};

//listeners
btnDeleteChronicCondition?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(chronicConditionInfo);
});
/** [END] FOOD **/