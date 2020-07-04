//Budgeting Application


//Budget Controller - controls the data involved in the budgeting activites 
var budgetController = (function () {
    
    //Expense constructor function (That's why it is capitalized)
    var Expense = function(id, description, value){
        this.id = id;
        this.description= description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    
    //Income constructor function (That's why it is capitalized)
    var Income = function(id, description, value) {
        this.id = id;
        this.description= description;
        this.value = value; 
    };
    
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
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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
        
        deleteItem: function(type, id){
            var IDs, index, typeArr;
            typeArr = data.allItems[type];
            
            IDs = typeArr.map(function(current) {
                return current.id;
            });
//            IDs = data.allItems[type].map(current => current.id);
            
            index = IDs.indexOf(id);
            if(index !== -1) {
               typeArr.splice(index, 1);
            }
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
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);  
            });
        },
        
        getPercentages: function(){
            var allPercentages = data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
            return allPercentages;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
        
    }
    var formatNumber = function(num, type){
        var numSplit, int, dec;

        /* 
        Rules:

        Plus or minus and space before the number
        exactly 2 decimal points
        comma seperating the thousands
        2310.4573 -> + 2,310.46
        -2000 -> - 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if(int.length > 3){
           if(int.length > 6){
         int = int.substr(0,int.length - 6) + ',' + int.substr(int.length - 6, 3) + ',' + int.substr(int.length - 3 , 3);
             //int.substr(int.length - 5, 3) + ',' + int.substr(int.length - , 3);
            } else {
               int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
            }
        }

        dec = numSplit[1];



        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
            }

            //2. Replace the placeholder text with some real data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));
            
            //3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
              
        },
        
        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
            
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
            var type;
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';  
            }
        
        },
        
        disaplayPercentages: function(percentages) {
            
            //returns Node List rather than an array
            //Nodes do not have the forEach method
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            
            //ForEach function that works for node lists
            var nodeListForEach = function(list, callbackFunc){
                for(var i =0; i < list.length; i++){
                    callbackFunc(list[i], i);
                }
            };
            
            nodeListForEach(fields, function(current, index) {
                //Do stuff with the Node list
                
                if(percentages[index] > 0){
                   current.textContent = percentages[index] + '%';
                } else{
                   current.textContent = '---';
                }
                
            });
                
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function () {
        
        //1. Calculate the budget
        bdgtCtrl.calcBudget();
        
        //2. Return the budget
        var bdgt = bdgtCtrl.getBudget();
        
        //3. Display the budget
        UICtrl.displayBudget(bdgt);
        
    };
    
    var updatePercentages = function (){
        
        //1. Calculate percentages
        bdgtCtrl.calculatePercentages();
        
        //2. Read percentages from the budget controller
        var percentages = bdgtCtrl.getPercentages();
        
        //3. Update the User interface with new percentages
        UICtrl.disaplayPercentages(percentages);
        
    }
    
    
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
            
            //6. Update percentages on exp/inc item
            updatePercentages();
        }
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID,type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            //example: inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1. Delete item from data structure
            bdgtCtrl.deleteItem(type, ID);

            //2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            //3.  Update and show new totals/budget
            updateBudget();
            
            //4. Update percentages on exp/inc item
            updatePercentages();
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



