/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/es6-promise/es6-promise.d.ts" />
/// <reference path="wizardStep.ts" />
var HeatingFactory = (function () {
    function HeatingFactory() {
        this.state = 0;
        this.data = {};
    }
    HeatingFactory.prototype.next = function () {
        switch (this.state) {
            case 0:
                this.state = 1;
                return new WizardConfig('name', WizardStep.text, { description: 'Heating Step Name' });
            case 1:
                this.state = 2;
                return new WizardConfig('menu', WizardStep.menu, ["time", "temperature"]);
            case 2:
                this.state = 3;
                if (this.data['menu'] == "temperature")
                    return new WizardConfig('qty', WizardStep.quantity, {
                        description: 'Heat the reactor to :',
                        allowed: [Dim.Temperature]
                    });
                if (this.data['menu'] == "time")
                    return new WizardConfig('qty', WizardStep.quantity, {
                        description: 'Keep last set temp for :',
                        allowed: [Dim.Temporal]
                    });
            default:
                return undefined;
        }
    };
    HeatingFactory.prototype.build = function () {
        if (this.data['menu'] == 'time') {
            return [
                new Step(this.data['name'] + '(start)', StepType.heating),
                new Step(this.data['name'] + '(reached)', StepType.heating)
            ];
        }
        if (this.data['menu'] == 'temperature') {
            return [new Step(this.data['name'], StepType.heating)];
        }
        return [new Step(this.data['name'], StepType.heating)];
    };
    HeatingFactory.prototype.isComplete = function () {
        return this.data['name'] !== undefined && this.data['qty'] !== undefined;
    };
    return HeatingFactory;
})();
