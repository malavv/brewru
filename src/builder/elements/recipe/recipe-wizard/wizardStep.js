/// <reference path="../../../lib/brew/brew.d.ts" />
var WizardStep;
(function (WizardStep) {
    WizardStep[WizardStep["text"] = 0] = "text";
    WizardStep[WizardStep["menu"] = 1] = "menu";
    WizardStep[WizardStep["ingredient"] = 2] = "ingredient";
    WizardStep[WizardStep["quantity"] = 3] = "quantity";
})(WizardStep || (WizardStep = {}));
var WizardConfig = (function () {
    function WizardConfig(propertyName, wizardPanel, config) {
        this.propertyName = propertyName;
        this.wizardPanel = wizardPanel;
        this.config = config;
    }
    return WizardConfig;
})();
var StepState = (function () {
    function StepState() {
        console.info("StepState[New Step Factory]");
    }
    return StepState;
})();
