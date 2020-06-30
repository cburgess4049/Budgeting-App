//Budgeting Application


//Budget Controller - controls the data involved in the budgeting activites 
var budgetController = (function () {
    
    //Expense constructor function (That's why it is capitalized)
    var Expense = function(id, description, value){
        this.id = id;
        this.description= description;
        this.value = value;
    }
    
    //Income constructor function (That's why it is capitalized)
    var Income = function(id, description, value) {
        this.id = id;
        this.description= description;
        this.value = value; 
    }
    
    //data structure for tracking all expense/income data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    
    return {
        //the object returned into the budget controller
        //public functions and variables go here
        
        addItem: function(type, des, val){
            var newItem, ID;
            //Finding/Creating the new ID
            if(data.allItems.length > 0){
                ID = data.allItems[type][data.allItems.length - 1].id + 1;
            } else{
                ID = 0;
            }
            
            
            //create item based on inc or exp type
            if(type === 'inc'){
               newItem = new Income(ID, des, val);
            } else {
               newItem = new Expense(ID, des, val);
            }
            
            //Push the new data to our data structure
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem;
        },
        
        testing: function(){
            console.log(data);
        }
    };
})();


//UI Controller - controls what is disaplyed to the user
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
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
        
        addListItem: function(obj, type) {
            var html, newHTML, element;
            
            //1. Create HTML String with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
            }

            //2. Replace the placeholder text with some real data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            //3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
              
        }, 
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
    
})();


//Controller - Connecting controller.  Knows both the budget and UI controller so it can bridge them
var controller = (function(bdgtCtrl, UICtrl) {
    
    var setUpEvevntListeners = function() {
        //DOM holds the object that contains all class strings for each DOM item
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event){
           if(event.key === 'Enter' || event.which === 13){
               event.preventDefault();
               ctrlAddItem(); 
            } 
        });
    }
    
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        //To Do
        //1. Get field input data
        input = UICtrl.getInput();

        //2. Add the item to the budget controller
        newItem = bdgtCtrl.addItem(input.type, input.description, input.value);
        
        //3. Add the new item to the UI controller
        UICtrl.addListItem(newItem, input.type);
        
        //4. Calculate the budget
        //5. Display the budget
        
    }



    
    return {
        //the object returned to the controller
        
        init: function(){
            setUpEvevntListeners();
        }
    }
    
})(budgetController, UIController);


//This initializes the controller to initialize the entire application 
controller.init();



