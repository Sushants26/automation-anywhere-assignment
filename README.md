# Automation Anywhere Assignment

Playwright-based UI automation testing project for **Automation Anywhere**.

This project contains UI automation implementations for multiple use cases using **Playwright, TypeScript, and the Page Object Model (POM)**.

Currently implemented use cases:

- **Use Case 1 – Message Box Task**
- **Use Case 2 – Form with Rules Builder**

The tests are organized by use case and use descriptive test names to clearly identify the functionality being automated.

---

## Framework & Tools

| Tool | Purpose |
|---|---|
| **Playwright** | Browser automation and end-to-end UI testing |
| **TypeScript** | Test automation programming language |
| **Node.js** | JavaScript/TypeScript runtime |
| **dotenv** | Environment variable management |
| **Chromium** | Browser used for test execution |
| **Git & GitHub** | Version control and source-code management |
| **Page Object Model (POM)** | Test architecture and reusable page interactions |

---

## Project Structure

```text
Automation_Anywhere_Assignment/
│
├── auth/
│   └── setup.ts
│
├── pages/
│   ├── TaskBotPage.ts
│   └── FormPage.ts
│
├── tests/
│   ├── usecase1-message-box.spec.ts
│   └── usecase2-form-rules.spec.ts
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── playwright.config.ts
```

Tests are organized by use case:

```text
tests/
├── usecase1-message-box.spec.ts
└── usecase2-form-rules.spec.ts
```

---

## Prerequisites

Install:

- Node.js
- npm
- Git

Verify:

```bash
node --version
npm --version
git --version
```

Also required:

- A valid Automation Anywhere Control Room account
- Access to the Automation Anywhere Control Room environment
- Chromium support through Playwright

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sushants26/automation-anywhere-assignment.git
```

### 2. Navigate to the project

```bash
cd automation-anywhere-assignment
```

### 3. Install dependencies

```bash
npm install
```

### 4. Install Playwright Chromium

```bash
npx playwright install chromium
```

---

## Environment Configuration

Create a `.env` file in the project root.

```env
AA_BASE_URL=https://community.cloud.automationanywhere.digital
AA_USERNAME=your_automation_anywhere_username
AA_PASSWORD=your_automation_anywhere_password
```

Environment variables:

| Variable | Description |
|---|---|
| `AA_BASE_URL` | Automation Anywhere Control Room URL |
| `AA_USERNAME` | Automation Anywhere username |
| `AA_PASSWORD` | Automation Anywhere password |

The `.env` file contains sensitive credentials and must not be committed to GitHub.

Use `.env.example` as the template.

---

## Authentication Setup

Authentication setup is located in:

```text
auth/setup.ts
```

Run:

```bash
npx tsx auth/setup.ts
```

After successful authentication, the Playwright authentication state is stored locally in:

```text
auth/auth-state.json
```

If the session expires, run the authentication setup again:

```bash
npx tsx auth/setup.ts
```

The authentication state must not be committed to GitHub.

---

# Running the Tests

## Run all tests

```bash
npx playwright test
```

## Run Use Case 1

```bash
npx playwright test tests/usecase1-message-box.spec.ts
```

## Run Use Case 1 in headed mode

```bash
npx playwright test tests/usecase1-message-box.spec.ts --headed
```

## Run Use Case 2

```bash
npx playwright test tests/usecase2-form-rules.spec.ts
```

## Run Use Case 2 in headed mode

```bash
npx playwright test tests/usecase2-form-rules.spec.ts --headed
```

## Debug a test

```bash
npx playwright test tests/usecase2-form-rules.spec.ts --debug
```

---

# Use Case 1 – Message Box Task

## Test Name

```text
Use Case 1 - Message Box Task - should create, configure, and run a Message Box Task Bot
```

## Objective

Automate the creation and execution of an Automation Anywhere Task Bot containing a Message Box action.

## Automated Workflow

1. Open Automation Anywhere Control Room.
2. Navigate to Automation.
3. Open the Automation repository.
4. Click Create.
5. Select Task Bot.
6. Enter the Task Bot name.
7. Create and open the Task Bot editor.
8. Search for Message Box.
9. Add the Message Box action.
10. Configure the Message Box.
11. Set the window title.
12. Set the message.
13. Configure scrollbar after lines.
14. Configure timeout.
15. Save.
16. Run the bot.
17. Verify the Message Box execution.

### Message Box Configuration

Window Title:

```text
Playwright Message Box
```

Message:

```text
Hello from Sushant's automation
```

Scrollbar After Lines:

```text
30
```

---

# Use Case 2 – Form with Rules Builder

## Test Name

```text
Use Case 2 - Form Rules Builder - complete Rules Builder flow
```

## Objective

Automate the creation and configuration of an Automation Anywhere Form and use the Form Rules Builder to create and configure multiple rules.

The workflow covers:

- Creating a new Form
- Adding at least two Text Box elements
- Configuring Text Box properties
- Opening the Rules Builder
- Creating Rule1
- Adding conditions
- Configuring AND/OR condition mode
- Adding a Set Value action
- Adding Rule2 and Rule3 using the rule context menu
- Verifying the rules
- Saving the Form

---

## Automated Workflow

### 1. Create a Fresh Form

The test:

1. Opens Automation Anywhere Control Room.
2. Navigates to the Automation repository.
3. Clicks Create.
4. Selects Form.
5. Enters a unique Form name.
6. Selects Create & edit.
7. Opens the Form Builder.

A unique Form name is generated using the current timestamp:

```text
PW_Form_Rules_<timestamp>
```

### 2. Find the Form Builder Frame

The Automation Anywhere Form Builder is loaded inside an iframe.

The test identifies the Form Builder iframe before interacting with the form.

### 3. Add Two Text Box Elements

The test verifies that Text Box is available in the Elements palette.

Two Text Box elements are added to the Form canvas using drag-and-drop.

Expected:

```text
Text Box 1
Text Box 2
```

---

## Text Box Configuration

### Text Box 1

```text
Label:
Name

Default Value:
Sushant

Minimum Length:
3

Maximum Length:
30

Hint:
Enter your name

Tooltip:
Enter the full name
```

### Text Box 2

```text
Label:
Status

Default Value:
Pending

Minimum Length:
3

Maximum Length:
30

Hint:
Enter the status

Tooltip:
Enter the current status
```

---

## Form Rules Builder

After configuring both Text Boxes, the test opens:

```text
Form rules
```

The test verifies that the Rules Builder is available.

### Rule1

The test creates:

```text
Rule1
```

The test verifies that Rule1 appears in the Rules Builder and is displayed in expanded mode.

The Edit control is also expected to be present on the rule card.

### Rule1 Conditions

The intended first condition is:

```text
Element:
Name

Condition:
Is not empty
```

The intended second condition is:

```text
Element:
Status

Condition:
Contains

Value:
<configured value>
```

The conditions are connected using:

```text
AND
```

Expected structure:

```text
IF

Name
    Is not empty

AND

Status
    Contains <value>
```

---

## AND / OR Condition Mode

The Rules Builder supports:

```text
AND
OR
```

The intended workflow uses:

```text
AND
```

for the second condition.

---

## Rule Action

The intended Rule1 action is:

```text
Set Value
```

The target element is:

```text
Status
```

Expected:

```text
THEN

Set Value
    Status
```

The test verifies that the action is assigned to the target element.

---

## Additional Rules

The test uses the rule card context menu to add a second rule below Rule1.

Expected:

```text
Rule1
  ↓
Add Rule Below
  ↓
Rule2
```

Then:

```text
Rule2
  ↓
Add Rule Below
  ↓
Rule3
```

Final expected rules list:

```text
Rule1
Rule2
Rule3
```

---

## Use Case 2 Assertions

The automation is designed to verify:

### Add Rule Button

- Add rule button is visible
- Add rule button is enabled
- Add rule creates a rule

### Rule Visibility

The following rules are expected to be visible:

```text
Rule1
Rule2
Rule3
```

### Expanded Mode

Rule1 is expected to be displayed in expanded mode after creation.

### Edit Button

An Edit control is expected on each rule card.

### Conditions

Verify:

- Element selection
- Condition type
- Value input visibility
- Condition configuration

### AND / OR

Verify that:

```text
AND
OR
```

condition modes are available and that the intended flow uses `AND`.

### Actions

Verify:

```text
Set Value
```

and its target element assignment.

### Add Rule Below

Verify that the rule card context menu can create additional rules below an existing rule.

### Persistence

Save the Form and verify that the expected rules remain visible.

---

# Test Organization

Tests are organized by use case:

```text
tests/
│
├── usecase1-message-box.spec.ts
└── usecase2-form-rules.spec.ts
```

Each test has a descriptive test name.

Example Use Case 1:

```typescript
test(
    'Use Case 1 - Message Box Task - should create, configure, and run a Message Box Task Bot',
    async ({ page }) => {
        // Test implementation
    }
);
```

Example Use Case 2:

```typescript
test(
    'Use Case 2 - Form Rules Builder - complete Rules Builder flow',
    async ({ page }) => {
        // Test implementation
    }
);
```

---

# Page Object Model

The project uses the Page Object Model architecture.

Page objects contain reusable UI interaction logic while test files contain the test workflow.

## Use Case 1

```text
pages/TaskBotPage.ts
```

Contains interactions for Task Bot creation and Message Box configuration.

## Use Case 2

```text
pages/FormPage.ts
```

Contains interactions for:

- Form creation
- Form Builder
- Form Builder iframe
- Text Box elements
- Text Box properties
- Rules Builder
- Rules
- Conditions
- AND/OR mode
- Actions
- Rule context menu
- Saving the Form

---

# Playwright Configuration

The project uses:

```text
playwright.config.ts
```

The configuration handles:

- Test directory
- Chromium browser
- Authentication state
- Base URL
- Test timeout
- Expect timeout
- Action timeout
- Navigation timeout
- Screenshots on failure
- Video recording on failure
- Trace recording
- HTML reporting

Base URL:

```env
AA_BASE_URL=https://community.cloud.automationanywhere.digital
```

---

# Test Reports

Open the Playwright HTML report:

```bash
npx playwright show-report
```

Failure artifacts may include:

- Screenshots
- Videos
- Trace files
- Error context
- HTML reports

---

# Debugging

Run Use Case 2 in headed mode:

```bash
npx playwright test tests/usecase2-form-rules.spec.ts --headed
```

Run in debug mode:

```bash
npx playwright test tests/usecase2-form-rules.spec.ts --debug
```

Open the HTML report:

```bash
npx playwright show-report
```

Open a trace:

```bash
npx playwright show-trace <trace-file>
```

---

# Environment / Configuration Notes

Automation Anywhere is a web application with dynamically loaded UI components.

The Form Builder is loaded inside an iframe, so the Use Case 2 Page Object identifies the Form Builder iframe before interacting with its UI.

The application may also load UI components asynchronously. Playwright assertions and waits are therefore used for important UI elements.

The Automation Anywhere UI can change between application versions or environments. If UI labels, iframe structure, or selectors change, the corresponding Page Object Model locators may need to be updated.

Authentication is handled separately through:

```text
auth/setup.ts
```

---


# Dependencies

Dependencies are defined in:

```text
package.json
```

Exact dependency versions are maintained in:

```text
package-lock.json
```

Install dependencies:

```bash
npm install
```

Install Chromium:

```bash
npx playwright install chromium
```

---



# Assignment Coverage

## Use Case 1 – Message Box Task

The repository contains automation for:

- Task Bot creation
- Message Box action
- Message Box configuration
- Bot execution
- Result verification

## Use Case 2 – Form with Rules Builder

The repository contains automation for:

- Form creation
- Form Builder
- Text Box elements
- Text Box property configuration
- Form Rules Builder
- Rule creation
- Conditions
- AND/OR condition mode
- Set Value action
- Additional rules
- Rule verification
- Form saving

---

# Author

**Sushant Singh**

GitHub:

```text
https://github.com/Sushants26
```
