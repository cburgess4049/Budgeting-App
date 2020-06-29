//Budgeting Application


//Budget Controller - controls the data involved in the budgeting activites 
var budgetController = (function () {

    return {
        //the object returned into the budget controller
        //public functions and variables go here
    }
})();




//UI Controller - controls what is disaplyed to the user
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }
    
    
    return{
        //the object returned into the ui controller
        //public functions and variables go here
        getInput: function() {
            //all input variables:
            //add__value, add__description, add__type inc or exp
            return {
            type :document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
            };

            

        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
    
})();


//Controller - Connecting controller.  Knows both the budget and UI controller so it can bridge them
var controller = (function(bdgtCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();
    var ctrlAddItem = function(){
                //To Do
        //1. Get field input data
        var input = UICtrl.getInput();
        console.log(input);
        //2. Add the item to the budget controller

        //3. Add the new item to the UI controller
        
        //4. Calculate the budget
        
        //5. Display the budget
        
    }
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
       if(event.key === 'Enter' || event.which === 13){
           event.preventDefault();
           ctrlAddItem(); 
        } 
    });


    
    return {
        //the object returned to the controller
    }
    
})(budgetController, UIController);




