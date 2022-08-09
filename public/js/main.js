//***GLOBAL
const SERVER_ADDRESS = "http://localhost:3000/api";
let chronicConditions;

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

async function addNewSafeCondition() {
    //pulls conditions names and ids from server
    if (!chronicConditions) { await getChronicConditions(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    safeForCondtionsDiv.appendChild(selectNode);

    //adds options to the dropdown
    chronicConditions.forEach(cc => {
        let option = new Option(cc.name, cc._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnSafeForConditions?.addEventListener('click', addNewSafeCondition);
/** [END] SAFE FOR CONDITIONS **/

/** NOT RECOMMENDED FOR CONDITIONS **/
//elements
const btnNotRecommendedForConditions = document.querySelector('#btn-add-new-not-recommended-condition');
const notRecommendedForCondtionsDiv = document.querySelector('#notRecommendedForConditions-selects');

async function addNewNotRecommendedForCondition() {
    //pulls conditions names and ids from server
    if (!chronicConditions) { await getChronicConditions(); }

    //creates new dropdown element and adds it to the DOM
    const selectNode = document.createElement("select");
    notRecommendedForCondtionsDiv.appendChild(selectNode);

    //adds options to the dropdown
    chronicConditions.forEach(cc => {
        let option = new Option(cc.name, cc._id);
        selectNode.appendChild(option);
    });
};

//listeners
btnNotRecommendedForConditions?.addEventListener('click', addNewNotRecommendedForCondition);
/** [END] NOT RECOMMENDED CONDITIONS **/