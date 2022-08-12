//***GLOBAL
const SERVER_ADDRESS = "http://localhost:3000/api";

//********* Add New [Buttons] */
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
const btnSafeForConditions = document.getElementById('btn-add-new-safe-condition');
const safeForCondtionsDiv = document.getElementById('safeForConditions-selects');

async function addNewSafeConditionSelect() {
    //pulls conditions names and ids from server
    if (!chronicConditions) { await getChronicConditions(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    selectNode.name = "safeForConditions";
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
const btnNotRecommendedForConditions = document.getElementById('btn-add-new-not-recommended-condition');
const notRecommendedForCondtionsDiv = document.getElementById('notRecommendedForConditions-selects');

async function addNewNotRecommendedForConditionSelect() {
    //pulls conditions names and ids from server
    if (!chronicConditions) { await getChronicConditions(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    selectNode.name = "notRecommendedForConditions";
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
const btnCompatibleWithDiets = document.getElementById('btn-add-new-diet');
const compatibleWithDietsDiv = document.getElementById('compatibleWithDiets-selects');

//vars
let diets;

//FIXME: Implement a better async solution to fetch values
let getDiets = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/diets`);
    diets = await response.json();
};

async function addNewCompatibleWithDietsSelect() {
    if (!diets) { await getDiets(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    selectNode.name = "compatibleWithDiets";
    compatibleWithDietsDiv.appendChild(selectNode);

    //adds options to the dropdown
    diets?.forEach(d => {
        let option = new Option(d.name, d._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnCompatibleWithDiets?.addEventListener('click', (event) => { 
    event.preventDefault();
    addNewCompatibleWithDietsSelect();
});
/** [END] DIET COMPATIBLE **/

/** MENSTRUAL PHASES **/
//elements
const btnMenstrualCyclePhase = document.getElementById('btn-add-new-phase');
const menstrualCyclePhaseDiv = document.getElementById('menstrualCyclePhases-selects');

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
    selectNode.name = "recommendedForCyclePhases";
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
    addNewDCyclePhaseSelect();
});
/** [END] MENSTRUAL PHASES **/

/** FOOD **/
//********* Delete [Button] */
//elements
const btnDeleteFood = document.getElementById('btn-delete-food');
const selectedFood = document.getElementById('select-food-selection');
const selectedFoodName = selectedFood.options[selectedFood.selectedIndex].text;
const selectedFoodId = selectedFood.options[selectedFood.selectedIndex].value;

let deleteFood = async () => {
    const isDelete = showDeleteConfirmation(selectedFoodName);
    if (!isDelete) return;
    
    const status = await sendDeleteCommand();
};

let showDeleteConfirmation = (name) => {
    return confirm(`¿Seguro que deseas borrar la comida '${name}'?`);
}

let sendDeleteCommand = async () => {
     const response = await fetch(`${SERVER_ADDRESS}/nutrition/food/${selectedFoodId}`,
      {method: 'DELETE'});
     const jsonResponse =  await response.json();
     return jsonResponse.status;
};

//listeners
btnDeleteFood?.addEventListener('click', (event) => { 
    event.preventDefault();
    deleteFood();
});
/** [END] FOOD **/