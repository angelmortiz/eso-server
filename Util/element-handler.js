console.log('Test');

const selectedFoodInfo = require('../../controllers/nutritionControllers/foodsController').selectedFoodInfo;

//SAFE FOR CONDITIONS
const btnSafeForConditions = document.querySelector('#btn-add-new-safe-condition');


function addNewSafeCondition() {
    console.log('Selected food:', selectedFoodInfo);
};

btnSafeForConditions.addEventListener('click', addNewSafeCondition);
