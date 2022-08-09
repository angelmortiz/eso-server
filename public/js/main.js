//GLOBAL
const SERVER_ADDRESS = "http://localhost:3000/api";

/** SAFE FOR CONDITIONS **/
//elements
const btnSafeForConditions = document.querySelector('#btn-add-new-safe-condition');
const safeForCondtionsDiv = document.querySelector('#safeForConditions-selects');

//variables
let chronicConditions;

async function addNewSafeCondition() {
    if (!chronicConditions) { await getChronicConditions(); }
    const selectNode = document.createElement("select");
    safeForCondtionsDiv.appendChild(selectNode);

    console.log('chronicConditions 1', chronicConditions);

    chronicConditions.forEach(cc => {
        let option = new Option(cc.name, cc._id);
        selectNode.appendChild(option);
    });
};

//FIXME: Implement a better async solution to fetch values
let getChronicConditions = async () => {
    const response = await fetch(`${SERVER_ADDRESS}/nutrition/chronicConditions`);
    chronicConditions = await response.json();
};

//listeners
btnSafeForConditions?.addEventListener('click', addNewSafeCondition);
/** [END] SAFE FOR CONDITIONS **/