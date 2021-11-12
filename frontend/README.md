# mTerms Web

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

The following installs need to be made before running the program:

- [swa cli](https://www.npmjs.com/package/@azure/static-web-apps-cli)
- [func cli v3](https://www.npmjs.com/package/azure-functions-core-tools)
- [node](https://nodejs.org/en/download/)
  <br></br>

## How to Run

### Step 1

Install necessary dependencies in both root folder, and in api folder

<pre>
npm install
cd api
npm install
cd ..
</pre>

### Step 2

Run the following command to start the frontend:

<pre>
npm start
</pre>

### Step 3

Open a new terminal, and run the following command to start the backend:

<pre>
npm run dev
</pre>

Open [http://localhost:4280](http://localhost:4280) to view it in the browser.
<br></br>

## Available Scripts

In the project directory, you can run:
<br></br>

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
<br></br>

### `npm run lint`

Runs eslint command formatting each file according to configs, and displays linter errors in console.
<br></br>

### `npm run cypress:open`

Before launching the Cypress command, you must have both frontend and backend running locally as shown in the section above. The command launches the Cypress interface where either all or specfic tests can be started. When running the tests, Cypress opens the specified browser and displays the simulation of each test in the browser.
<br></br>

### `npm run cypress:run`

Before launching the Cypress command, you must have both frontend and backend running locally as shown in the section above. The command will run all Cypress tests in the background, and display the results in terminal.
<br></br>

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.
<br></br>

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.
<br></br>

## Create infrastructure

If not created already, you will need to create a resourcegroup, with a keyVault. In the keyVault, you will need a secret called githubToken. You can generate this by accessing github settings and creating a personal access token with the permissions to create workflows.

`az deployment group create --resource-group mterms-rg --template-file ./infra/main.bicep `
