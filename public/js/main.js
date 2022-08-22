/*** GLOBAL VARIABLES ***/
//#region
const SERVER_ADDRESS = "http://localhost:3000/api";
//#endregion
/*** [END]GLOBAL VARIABLES ***/

/*** INFO GETTERS ***/
//#region
/** GETTERS **/
let foods;
let getFoods = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/foods`);
    foods = await response.json();
    return foods
};

let diets;
let getDiets = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/diets`);
    diets = await response.json();
    return diets;
};

let chronicConditions;
let getChronicConditions = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/chronicConditions`);
    chronicConditions = await response.json();
    return chronicConditions
};

let phases;
let getPhases = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/menstrualCyclePhases`);
    phases = await response.json();
    return phases;
};

let exercises;
let getExercises = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/activities/exercises`);
    exercises = await response.json();
    return exercises;
};

let exerciseTypes;
let getExerciseTypes = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/activities/exerciseTypes`);
    exerciseTypes = await response.json();
    return exerciseTypes;
};

let muscles;
let getMuscles = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/activities/muscles`);
    muscles = await response.json();
    return muscles;
};

let equipments;
let getEquipments = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/activities/equipments`);
    equipments = await response.json();
    return equipments;
};

let physicalConditions;
let getPhysicalConditions = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/activities/physicalConditions`);
    physicalConditions = await response.json();
    return physicalConditions
};
/** [END] GETTERS **/
//#endregion
/*** [END] INFO GETTERS ***/

/*** ADDING ELEMENTS TO DOM ***/
//#region
//** Add New [Buttons] **/
//SELECTS
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

//INPUTS
let addInputToDiv = async (inputName, divNode) => {
    //creates new input element and adds it to the DOM
    const inputNode = document.createElement("input");
    inputNode.name = inputName;
    divNode.appendChild(inputNode);
}

//TEXTAREAS
let addTextAreaToDiv = async (txtAreaName, divNode) => {
    //creates new textarea element and adds it to the DOM
    const textAreaNode = document.createElement("textarea");
    textAreaNode.name = txtAreaName;
    textAreaNode.rows = 2;
    divNode.appendChild(textAreaNode);
}
//** [END] Add New [Buttons] **/

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
const notRecommendedForConditionsDiv = document.getElementById('notRecommendedForConditions-selects');

//listeners
btnNotRecommendedForConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(chronicConditions, getChronicConditions, "notRecommendedForConditions", notRecommendedForConditionsDiv);
});
/** [END] NOT RECOMMENDED CONDITIONS **/

/* DIET COMPATIBLE */
//elements
const btnCompatibleWithDiets = document.getElementById('btn-add-new-diet');
const compatibleWithDietsDiv = document.getElementById('compatibleWithDiets-selects');

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

//listeners
btnMenstrualCyclePhase?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(phases, getPhases, "recommendedForCyclePhases", menstrualCyclePhaseDiv);
});
/** [END] PHASES */

/* SYMPTOMS */
//elements
const btnAddSymptom = document.getElementById('btn-add-new-symptom');
const symptomDiv = document.getElementById('symptoms-input');

//listeners
btnAddSymptom?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("symptoms", symptomDiv);
});
/** [END] SYMPTOMS */

/** CAUSES */
//elements
const btnAddNewCauses = document.getElementById('btn-add-new-cause');
const causesDiv = document.getElementById('causes-input');

//listeners
btnAddNewCauses?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("causes", causesDiv);
});
/** [END] CAUSES */

/** TREATMENTS */
//elements
const btnAddNewTreatments = document.getElementById('btn-add-new-treatment');
const treatmentsDiv = document.getElementById('treatments-input');

//listeners
btnAddNewTreatments?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("treatments", treatmentsDiv);
});
/** [END] TREATMENTS */

/** TESTS */
//elements
const btnAddNewTests = document.getElementById('btn-add-new-test');
const testsDiv = document.getElementById('tests-input');

//listeners
btnAddNewTests?.addEventListener('click', (event) => { 
    event.preventDefault();
    addInputToDiv("tests", testsDiv);
});
/** [END] TESTS */
/** [END] Select Creators **/

//#endregion
/*** [END] ADDING ELEMENTS TO DOM ***/

/*** DELETE ACTION ***/
//#region
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
//#endregion
/*** [END] DELETE ACTION ***/

/***********************************/
/***********************************/
/***********************************/

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

/*** RECIPE ***/
//#region
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

/*** CHRONIC CONDITION ***/
//#region
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

/*** EXERCISE ***/
//#region
/** Select Creators **/
/* SECONDARY MUSCLES */
//elements
const btnAddSecondaryMuscle = document.getElementById('btn-add-new-secondaryMuscle');
const secondaryMusclesDiv = document.getElementById('secondaryMuscles-selects');

//listeners
btnAddSecondaryMuscle?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(muscles, getMuscles, "secondaryMuscles", secondaryMusclesDiv);
});

/* EXERCISE TYPES */
//elements
const btnAddExerciseTypes = document.getElementById('btn-add-new-exerciseTypes');
const exerciseTypesDiv = document.getElementById('exerciseTypes-selects');

//listeners
btnAddExerciseTypes?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(exerciseTypes, getExerciseTypes, "types", exerciseTypesDiv);
});

/* EQUIPMENTS */
//elements
const btnAddEquipments = document.getElementById('btn-add-new-equipments');
const equipmentsDiv = document.getElementById('equipments-selects');

//listeners
btnAddEquipments?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(equipments, getEquipments, "equipments", equipmentsDiv);
});
/** [END] Select Creators **/

/* SAFE FOR PHYSICAL CONDITIONS */
//elements
const btnAddPhysicalConditions = document.getElementById('btn-add-new-safe-physicalCondition');
const physicalConditionsDiv = document.getElementById('safeForPhysicalConditions-selects');

//listeners
btnAddPhysicalConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(physicalConditions, getPhysicalConditions, "safeForConditions", physicalConditionsDiv);
});

/* NOT RECOMMENDED FOR PHYSICAL CONDITIONS */
//elements
const btnAddNotRecommendedPhysicalConditions = document.getElementById('btn-add-new-not-recommended-physicalCondition');
const notRecommendedPhysicalConditionsDiv = document.getElementById('notRecommendedForPhysicalCondition-selects');

//listeners
btnAddNotRecommendedPhysicalConditions?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(physicalConditions, getPhysicalConditions, "notRecommendedForConditions", notRecommendedPhysicalConditionsDiv);
});
/** [END] Select Creators **/

//** Delete [Button] **/
//elements
const btnDeleteExercise = document.getElementById('btn-delete-exercise');
const selectedExercise = document.getElementById('select-exercise-selection');
const selectedExerciseName = selectedExercise?.options[selectedExercise.selectedIndex].text;
const selectedExerciseId = selectedExercise?.options[selectedExercise.selectedIndex].value;
const exerciseInfo = {
    database: 'activities',
    type: 'exercise',
    typeDisplay: 'ejercicio',
    name: selectedExerciseName,
    id: selectedExerciseId
};

//listeners
btnDeleteExercise?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(exerciseInfo);
});
//#endregion
/*** [END] EXERCISE ***/

/*** MUSCLE ***/
//#region
//** Delete [Button] **/
//elements
const btnDeleteMuscle = document.getElementById('btn-delete-muscle');
const selectedMuscle = document.getElementById('select-muscle-selection');
const selectedMuscleName = selectedMuscle?.options[selectedMuscle.selectedIndex].text;
const selectedMuscleId = selectedMuscle?.options[selectedMuscle.selectedIndex].value;
const muscleInfo = {
    database: 'activities',
    type: 'muscle',
    typeDisplay: 'músculo',
    name: selectedMuscleName,
    id: selectedMuscleId
};

//listeners
btnDeleteMuscle?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(muscleInfo);
});
//#endregion
/*** [END] MUSCLE ***/

/*** EQUIPMENT ***/
//#region
//elements
const btnExercises = document.getElementById('btn-add-new-exercise');
const exercisesDiv = document.getElementById('exercises-selects');

//listeners
btnExercises?.addEventListener('click', (event) => { 
    event.preventDefault();
    addSelectToDiv(exercises, getExercises, "exercises", exercisesDiv);
});

//** Delete [Button] **/
//elements
const btnDeleteEquipment = document.getElementById('btn-delete-equipment');
const selectedEquipment = document.getElementById('select-equipment-selection');
const selectedEquipmentName = selectedEquipment?.options[selectedEquipment.selectedIndex].text;
const selectedEquipmentId = selectedEquipment?.options[selectedEquipment.selectedIndex].value;
const equipmentInfo = {
    database: 'activities',
    type: 'equipment',
    typeDisplay: 'equipo',
    name: selectedEquipmentName,
    id: selectedEquipmentId
};

//listeners
btnDeleteEquipment?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(equipmentInfo);
});
//#endregion
/*** [END] EQUIPMENT ***/

/*** PHYSICAL CONDITION ***/
//#region
//** Delete [Button] **/
//elements
const btnDeletePhysicalCondition = document.getElementById('btn-delete-physicalCondition');
const selectedPhysicalCondition = document.getElementById('select-physicalCondition-selection');
const selectedPhysicalConditionName = selectedPhysicalCondition?.options[selectedPhysicalCondition.selectedIndex].text;
const selectedPhysicalConditionId = selectedPhysicalCondition?.options[selectedPhysicalCondition.selectedIndex].value;
const physicalConditionInfo = {
    database: 'activities',
    type: 'physicalCondition',
    typeDisplay: 'condición crónica',
    name: selectedPhysicalConditionName,
    id: selectedPhysicalConditionId
};

//listeners
btnDeletePhysicalCondition?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteDocument(physicalConditionInfo);
});
//#endregion
/*** [END] PHYSICAL CONDITION ***/