import { test, expect } from '@playwright/test';
import { FormPage } from '../pages/FormPage';

test(
    'Use Case 2 - Form Rules Builder - complete Rules Builder flow',
    async ({ page }) => {
        test.setTimeout(300_000);

        const formPage = new FormPage(page);
        const formName = `PW_Form_Rules_${Date.now()}`;

        console.log('\n==========================================');
        console.log('USE CASE 2 - FORM RULES BUILDER');
        console.log('==========================================');
        console.log('New Form name:', formName);

        // 1. Create a fresh Form.
        await formPage.createFreshForm(formName);

        // 2. Find the embedded Form Builder.
        await formPage.findFormBuilderFrame();

        // 3. Verify Text Box is available.
        await formPage.verifyTextBoxAvailable();

        // 4. Add two Text Box elements.
        await formPage.addTwoTextBoxes();

        // 5. Configure both Text Boxes.
        await formPage.configureBothTextBoxes();

        // 6. Open Rules Builder.
        await formPage.openRulesBuilder();

        // 7. Create Rule1.
        await formPage.addFirstRule();

        // 8. Add and configure first condition:
        //    Name -> Is Not Empty.
        await formPage.addFirstCondition();
        await formPage.configureFirstCondition();

        // 9. Add second condition with AND:
        //    Status -> Contains -> Pending.
        //    addSecondConditionWithAND() performs the complete operation.
        await formPage.addSecondConditionWithAND();

        // 10. Add Set Value action targeting Status.
        await formPage.addSetValueAction();

        // 11. Add Rule2 using the Rule card context menu.
        await formPage.addRuleBelow();

        // 12. Add Rule3 using the Rule card context menu.
        await formPage.addRuleBelow();

        // 13. Verify Rule1, Rule2 and Rule3.
        await formPage.verifyRules([
            'Rule1',
            'Rule2',
            'Rule3'
        ]);

        // 14. Save and verify persistence after reload.
        await formPage.saveForm();

        // Final URL assertion.
        expect(page.url()).toContain('/module/attended/form/edit');

        console.log('\n==========================================');
        console.log('✓ USE CASE 2 COMPLETED');
        console.log('✓ Fresh Form created');
        console.log('✓ Two Text Boxes added');
        console.log('✓ Text Box properties configured');
        console.log('✓ Rules Builder opened');
        console.log('✓ Rule1 created and expanded');
        console.log('✓ Name -> Is Not Empty configured');
        console.log('✓ Second condition added with AND');
        console.log('✓ Status -> Contains -> Pending configured');
        console.log('✓ Set Value action assigned to Status');
        console.log('✓ Rule2 created with Add Rule Below');
        console.log('✓ Rule3 created with Add Rule Below');
        console.log('✓ Rule1, Rule2 and Rule3 verified');
        console.log('✓ Form saved');
        console.log('✓ Rules verified after reload');
        console.log('==========================================');
    }
);
