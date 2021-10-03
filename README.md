# Test react application for managing participants list

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Actions

Optional: modify src/data.json for initial set of participants

### 'npm install' to resolve dependencies
### `npm start` to play

Build production version of application
### `npm run build`

## Description of app
On start (window open) application loads predefined set of participants (hardcoded) and allows to view and modify it.

Click on table headers to sort.

Enter data and click on "Add new" to append participant.

Click on "edit" pen near participant to see/modify data inline (<b>NOTE</b>: on selection of another row no warnings, any changes are lost and another line is edited!).

Click on "delete" icon of participant to immediately delete participant (<b>NOTE</b>: no warnings, just delete)

Source changes: javascript: applied functional style, removed "old" staff, UI: adapted to expected?! sorting view/behaviour.
