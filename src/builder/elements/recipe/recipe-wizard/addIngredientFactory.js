/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/es6-promise/es6-promise.d.ts" />
/// <reference path="wizardStep.ts" />
var AddIngredientFactory = (function () {
    function AddIngredientFactory() {
        this.state = 0;
        this.data = {};
    }
    AddIngredientFactory.prototype.next = function () {
        switch (this.state) {
            case 0:
                this.state = 1;
                return new WizardConfig('name', WizardStep.text, { description: 'Ingredient Step Name' });
            case 1:
                this.state = 2;
                return new WizardConfig('menu', WizardStep.menu, Supply.IngType.all().map(function (t) { return t.name; }));
            case 2:
                this.state = 3;
                return new WizardConfig('ingredient', WizardStep.ingredient, Supply.IngType.of(this.data['menu']));
            case 3:
                this.state = 4;
                return new WizardConfig('qty', WizardStep.quantity, {
                    description: 'How Much :',
                    allowed: this.data['ingredient'].dimensions()
                });
            default:
                return undefined;
        }
    };
    AddIngredientFactory.prototype.build = function () {
        return [new Step(this.data['name'], StepType.addIngredient)];
    };
    AddIngredientFactory.prototype.isComplete = function () {
        return this.data['name'] !== undefined && this.data['qty'] !== undefined;
    };
    return AddIngredientFactory;
})();
