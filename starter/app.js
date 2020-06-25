//Budgeting Application

var budgetController = (function () {
    var x = 23;
    
    var add = function(a) {
        return x + a;
    }
    return {
        publicTest: function(b) {
            return add(b);
        }
    }
})();






var UIController = (function() {
    
    //Code for the UI controller
    
    
})();


//Connecting controller.  Knows both the budget and UI controller so it can bridge them
var controller = (function(bdgtCtrl, UICtrl) {
    var z = bdgtCtrl.publicTest(20);
    
    return {
        anotherPublic: function() {
            console.log(z);
        }
    }
    
})(budgetController, UIController);