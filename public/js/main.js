/*** GLOBAL FUNCTIONS AND VARIABLES ***/
//#region
const SERVER_ADDRESS = "http://localhost:3000/api";

//** Add New [Buttons] **/
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

//INPUT
let addInputToDiv = async (inputName, divNode) => {
    //creates new input element and adds it to the DOM
    const inputNode = document.createElement("input");
    inputNode.name = inputName;
    divNode.appendChild(inputNode);
}

//TEXTAREA
let addTextAreaToDiv = async (txtAreaName, divNode) => {
    //creates new textarea element and adds it to the DOM
    const textAreaNode = document.createElement("textarea");
    textAreaNode.name = txtAreaName;
    textAreaNode.rows = 2;
    divNode.appendChild(textAreaNode);
}

//** DELETE ACTIONS **/
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

//** GET CONDITIONS **/
let chronicConditions;
let getChronicConditions = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/chronicConditions`);
    chronicConditions = await response.json();
    return chronicConditions
};
//#endregion
/*** [END]GLOBAL FUNCTIONS AND VARIABLES ***/

/*** [REUSABLE] ADDING SELECTS TO DOM ***/
//#region
/** Select Creators **/
/* SAFE FOR CONDITIONS */
//elements
const btnSafeForConditions = document.getElementById('btn-add-new-safe-condition');
const safeForCondtionsDiv = document.getElementById('safeForConditions-selects');

//listeners
btnSafeForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(chronicConditions, getChronicConditions, "safeForConditions", safeForCondtionsDiv);
});
/** [END] SAFE FOR CONDITIONS **/

/* NOT RECOMMENDED FOR CONDITIONS */
//elements
const btnNotRecommendedForConditions = document.getElementById('btn-add-new-not-recommended-condition');
const notRecommendedForCondtionsDiv = document.getElementById('notRecommendedForConditions-selects');

//listeners
btnNotRecommendedForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(chronicConditions, getChronicConditions, "notRecommendedForConditions", notRecommendedForCondtionsDiv);
});
/** [END] NOT RECOMMENDED CONDITIONS **/

/* DIET COMPATIBLE */
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

/* MENSTRUAL PHASES */
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
/** [END] Select Creators **/
//#endregion
/*** [END] [REUSABLE] ADDING SELECTS TO DOM ***/


/*** FOOD ***/
//#region
//** Delete [Button] **/
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
})
//** [END] Delete [Button] **/
//#endregion
/*** [END] FOOD ***/

/*** CHRONIC CONDITION ***/
//#region
/** Input Creators **/
/* SYMPTOMS */
//elements
const btnAddSymptom = document.getElementById('btn-add-new-symptom');
const symptomDiv = document.getElementById('symptoms-input');

//listeners
btnAddSymptom?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("symptoms", symptomDiv);
});

/** CAUSES */
//elements
const btnAddNewCauses = document.getElementById('btn-add-new-cause');
const causesDiv = document.getElementById('causes-input');

//listeners
btnAddNewCauses?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("causes", causesDiv);
});

/** TREATMENTS */
//elements
const btnAddNewTreatments = document.getElementById('btn-add-new-treatment');
const treatmentsDiv = document.getElementById('treatments-input');

//listeners
btnAddNewTreatments?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("treatments", treatmentsDiv);
});

/** TESTS */
//elements
const btnAddNewTests = document.getElementById('btn-add-new-test');
const testsDiv = document.getElementById('tests-input');

//listeners
btnAddNewTests?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("tests", testsDiv);
});

//** Delete [Button] **/
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
//#endregion
/*** [END] CHRONIC CONDITION ***/

/*** DIET ***/
//#region
//***** Delete [Button] */
//elements
const btnDeleteDiet = document.getElementById('btn-delete-diet');
const selectedDiet = document.getElementById('select-diet-selection');
const selectedDietName = selectedDiet?.options[selectedDiet.selectedIndex].text;
const selectedDietId = selectedDiet?.options[selectedDiet.selectedIndex].value;
const dietInfo = {
    database: 'nutrition',
    type: 'diet',
    typeDisplay: 'dieta',
    name: selectedDietName,
    id: selectedDietId
};

//listeners
btnDeleteDiet?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(dietInfo);
});
//#endregion
/*** [END] CHRONIC CONDITION ***/

/*** RECIPE ***/
//#region
//** GET FOODS **/
let foods;
let getFoods = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/foods`);
    foods = await response.json();
    return foods
};

/** Select Creators **/
/* INGREDIENTS */
//elements
const btnAddIngredient = document.getElementById('btn-add-new-ingredient');
const ingredientsDiv = document.getElementById('ingredients-selects');

//listeners
btnAddIngredient?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(foods, getFoods, "ingredients", ingredientsDiv);
});

/* INSTRUCTIONS */
//elements
const btnAddInstruction = document.getElementById('btn-add-new-instruction');
const instructionDiv = document.getElementById('instructions-textarea');

//listeners
btnAddInstruction?.addEventListener('click', (event) => { 
    event.preventDefault();
    addTextAreaToDiv("instructions", instructionDiv);
});

/** UTENSILS */
//elements
const btnAddUtensils = document.getElementById('btn-add-new-utensil');
const utensilsDiv = document.getElementById('utensils-input');

//listeners
btnAddUtensils?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("utensils", utensilsDiv);
});

/** [END] Select Creators **/

//***** Delete [Button] */
//elements
const btnDeleteRecipe = document.getElementById('btn-delete-recipe');
const selectedRecipe = document.getElementById('select-recipe-selection');
const selectedRecipeName = selectedRecipe?.options[selectedRecipe.selectedIndex].text;
const selectedRecipeId = selectedRecipe?.options[selectedRecipe.selectedIndex].value;
const recipeInfo = {
    database: 'nutrition',
    type: 'recipe',
    typeDisplay: 'receta',
    name: selectedRecipeName,
    id: selectedRecipeId
};

//listeners
btnDeleteRecipe?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(recipeInfo);
});
//#endregion
/*** [END] RECIPE ***/