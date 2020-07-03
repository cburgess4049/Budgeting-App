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
    
    //Calculates the totals for a given type.  If given 'exp' it will loop through the Expenses in the exp array found in the data object under allItems, and will total their values.
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;                            
        });
        
        data.totals[type] = sum;
    };
    
    //data structure for tracking all expense/income data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        
        calcBudget: function(){
            
            //Calculate sum of all Income
            calculateTotal('inc');
            
            //Calculate sum of all Expenses
            calculateTotal('exp');
            
            //Calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //Calculate percentage of income spent rounded to the nearest integer.  Should only be calced if the total income is greater than 0.
            if(data.totals.inc > 0){
               data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
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
        expenseContainer: '.expenses__list',
        expensesLabel: '.budget__expenses--value',
        incomeLabel: '.budget__income--value',
        budgetLabel: '.budget__value',
        percentageLabel: '.budget__expenses--percentage'
        
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
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
        
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription  + ',' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(obj){
            if(obj.budget > 0) {
                document.querySelector(DOMstrings.budgetLabel).textContent = '+ ' + obj.budget;
            }else if(obj.budget < 0) {
                document.querySelector(DOMstrings.budgetLabel).textContent = '- ' + (obj.budget * -1);
            } else {
                document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            }

            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage > 0){
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';  
            }
        
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
    };
    
    var updateBudget = function () {
        
        //1. Calculate the budget
        bdgtCtrl.calcBudget();
        
        //2. Return the budget
        var bdgt = bdgtCtrl.getBudget();
        
        //3. Display the budget
        UICtrl.displayBudget(bdgt);
        
    };
    
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        //To Do
        //1. Get field input data
        input = UICtrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value !== 0 ){
            //2. Add the item to the budget controller
            newItem = bdgtCtrl.addItem(input.type, input.description, input.value);

            //3. Add the new item to the UI controller
            UICtrl.addListItem(newItem, input.type);


            //4. Clear the fields
            UICtrl.clearFields();

            //5. Calcuate and update budget
            updateBudget();
        }
        

        
    };


    
    return {
        //the object returned to the controller
        
        init: function(){
            setUpEvevntListeners();
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1 ,
                totalInc: 0,
                totalExp: 0
            });
        }
    }
    
})(budgetController, UIController);


//This initializes the controller to initialize the entire application 
controller.init();



