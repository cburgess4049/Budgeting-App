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
    
    
    
    return{
        //the object returned into the ui controller
        //public functions and variables go here
        getInput: function() {
            //all input variables:
            //add__value, add__description, add__type inc or exp
            return {
            type :document.querySelector('.add__type').value,
            description: document.querySelector('.add__description').value,
            value: document.querySelector('.add__value').value
            };

            

        }
    }
    
})();


//Controller - Connecting controller.  Knows both the budget and UI controller so it can bridge them
var controller = (function(bdgtCtrl, UICtrl) {

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
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
       if(event.keyCode === 13 || event.which === 13){
           ctrlAddItem(); 
        } 
    });


    
    return {
        //the object returned to the controller
    }
    
})(budgetController, UIController);




