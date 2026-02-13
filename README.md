# Quiz App

This is a modular Quiz and Exam web application built using vanilla JavaScript (ES6+). The project was structured with a strong focus on separation of concerns, modular design, and testability using Jest.

The application supports both a normal practice mode and a stricter exam mode with a countdown timer and submission control.

---

## Overview

The project is divided into clear layers:

* Data layer (question data)
* Core logic layer (quiz engine and timer)
* UI layer (practice mode and exam mode behavior)
* Entry files for each page

The idea behind this structure is to keep business logic separate from DOM manipulation so that the core functionality can be tested independently.

---

## Features

### Practice Mode

* Navigate freely between questions
* Select and change answers
* See final score after completing the quiz
* Retake the quiz

### Exam Mode

* Countdown timer
* Confirmation before submission
* Automatic submission when time runs out
* Prevention of accidental navigation

---

## Project Structure

```
Quiz-App/
│
├── src/
│   ├── quizEngine.js
│   ├── timer.js
│   ├── quizUI.js
│   ├── examUI.js
│   ├── quizData.js
│   ├── index.js
│   ├── typedText.js
│   └── examEntry.js
├── tests/
│   ├── quizEngine.test.js
│   └── timer.test.js
├── index.html
├── quiz.html
├── exam.html
├── about.html
├── contact.html
├── package-lock.json
├── package.json
├── jest.config.js
├── styles.css
└── README.md
```

* `quizEngine.js` contains the core quiz state logic.
* `timer.js` implements a reusable countdown timer module.
* `quizUI.js` and `examUI.js` handle DOM interaction and page behavior.
* `index.js` and `examEntry.js` act as entry points for each page.

---

## Setup Instructions

### Install dependencies

From the project root directory:

```
npm install
```

If Jest is not installed yet:

```
npm install --save-dev jest
```

---

## Testing with Jest

The core logic modules are designed to be testable.

To run tests:

```
npm test
```

The following modules are tested:

* quizEngine.js
* timer.js

UI files are not unit tested since they primarily handle DOM manipulation.

---

## Design Approach

The application is built around a state-driven approach:

* The quiz engine manages state.
* The timer module emits events.
* The UI reacts to state changes.
* No global logic leakage between modules.

This makes the project easier to maintain and extend.

---

## Possible Improvements

* Add persistent storage using localStorage
* Add question randomization
* Add adaptive difficulty
* Add backend integration
* Add accessibility refinements
* Add result export functionality

---

## Author

Aditya Desai

The Site is deployed on [https://adi-25704.github.io/Quiz-App/index.html]
