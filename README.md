# Code Template Tool

Generate files/folders based on templates.

## Features

* Template describes the shape of the file content as well as the folder structure.

* Destination folder path can be specified via right-click context or active editor, and be modified in user input interface.

* Folders that do not exist can be cerated recursively.

* Allow variables in file content as well as file/folder names. 
  
* Support multiple identifier styles.

  * <span id="case-style">Case style</span>

    | Case            | Example       |  
    | --------------- | ------------- |  
    | camelCase       | myLovelyCat   |  
    | pascalCase      | MyLovelyCat   |  
    | snakeCase       | my_lovely_cat |  
    | kebabCase       | my-lovely-cat |  
    | snakeUpperCase  | MY_LOVELY_CAT |  
    | snakePascalCase | My_Lovely_Cat |  
    | kebabUpperCase  | MY-LOVELY-CAT |  
    | kebabPascalCase | My-Lovely-Cat |  
    | upperCase       | MYLOVELYCAT   |  
    | lowerCase       | mylovelycat   |  

  * Prefix and suffix
  
    Identifiers can be prefixed or suffixed with any visible characters.

## Usage

### Commands

* `template: Edit Templates`

  Open the templates folder in a new window.

* `template: Reload Templates`

  Remember to call this command to update templates metadata cached in memory after __editing templates config files__,
  __adding new templates__ or __deleting existing templates__.

* `template: New File / Folder From Template`

  To select a template and generate codes based on it.

### Call commands

* Open [_`command palette`_](https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_command-palette) and input a command.

* Right click code area of the active editor and pick a command from the popup menu.

* Right click file/folder names or space area of the [_explorer window_](https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_move-to-explorer-window) and pick a command from the popup menu. 

### Destination Folder

* The initial destination folder may be the active editor's folder, right clicked folder, right clicked file's folder, 
workspace folder or user home folder based on the `template: New File / Folder From Template` command's invocation mode.

* Destination folder will show and can be changed in user input interface.

### Define Templates

#### Templates folder

All templates should be defined in the templates folder (Specified by the setting `codeTemplateTool.templatesPath`.)
If the specified folder does not exist, it will be auto created.

By default, it's `{homedir}/.vscode/templates`.

#### Template structure 

```js
+ exampleTemplate              // template define folder
  - template.config.json       // template configuration file
  - {other files and folders}  // template content
```

* Template content
    

  __Example1:__ 

  ---

  ```js
  // The template content is a folder and what it contains.

  + ___PageName___Page        // folder with variable in it's name
    - index.js                // file with fixed name
    - ___PageName___Page.js   // file with variable in it's name
    - ___pageName___Page.css
    - ___pageName__Model.js
    + components              // sub folder with fixed name
  ```

  `___PageName___Page.js`
  ```js
  import React from 'react'
  import { connectModel } from 'reduxModel'
  import ___pageName___Model from './___pageName___Model'
  import './___pageName___Style.scss'
  
  class ___PageName___Page extends React.Component {
      componentDidMount() {
  
      }
  
      render() {
          return (
              <div className="___page-name___">
  
              </div>
          )
      }
  }
  
  export default connectModel(___pageName___Model, state => ({
      ___pageName___: state.___pageName___,
  }))(___PageName___Page)
  ```

  `___pageName___Model.js`
  ```js
  import {
      createModel,
      ___initialStateType___InitialState,
      ___reducerType___Reducer,
  } from 'reduxModel'

  const ___pageName___Model = createModel({
      name: '___pageName___',
      initialState: ___initialStateType___InitialState,
      asyncOperations: [
          {
              get___PageName___: (success, fail) => ({
                  api: {
                      success,
                      fail,
                  },
              }),
              reducers: ___reducerType___Reducer,
          },
      ],
      syncOperations: [
          {
              reset___PageName___: () => {},
              reducer: () => ___initialStateType___InitialState,
          },
      ],
  })

  export default ___pageName___Model
  ```

  ...other files

  _If the configuration file is:_
  
  `template.config.json`
  ```json
  {
      "name": "Common Page Template",
      "variables": ["pageName", "initialStateType", "reducerType"]
  }
  ```

  or

  `template.config.json`
  ```json
  {
      "name": "Common Page Template",
      "variables": [
          {
              "name": "pageName",
              "style": {
                  "case": "auto"
              }
          },
          {
              "name": "initialStateType",
              "style": {
                  "case": "auto"
              }
          },
          {
              "name": "reducerType",
              "style": {
                  "case": "auto"
              }
          },
      ]
  }
  ```

  _and the user inputs are as follows:_

  ```
  pageName: lovelyCats
  initialStateType: list
  reducerType: list
  ```

  _Then the generated content will be:_

  ```js
  // Folder structure

  + LovelyCatsPage
    - index.js
    - LovelyCatsPage.js
    - lovelyCatsPage.css
    - lovelyCatsModel.js
    + components
  ```

  `LovelyCatsPage.js`
  ```js
  import React from 'react'
  import { connectModel } from 'reduxModel'
  import lovelyCatsModel from './lovelyCatsModel'
  import './lovelyCatsPage.scss'
  
  class LovelyCatsPage extends React.Component {
      componentDidMount() {
  
      }
  
      render() {
          return (
              <div className="lovely-cats">
  
              </div>
          )
      }
  }
  
  export default connectModel(lovelyCatsModel, state => ({
      lovelyCats: state.lovelyCats,
  }))(LovelyCatsPage)
  ```

  `lovelyCatsModel.js`
  ```js
  import {
      createModel,
      listInitialState,
      listReducer,
  } from 'reduxModel'

  const lovelyCatsModel = createModel({
      name: 'lovelyCats',
      initialState: listInitialState,
      asyncOperations: [
          {
              getLovelyCats: (success, fail) => ({
                  api: {
                      success,
                      fail,
                  },
              }),
              reducers: listReducer,
          },
      ],
      syncOperations: [
          {
              resetLovelyCats: () => {},
              reducer: () => listInitialState,
          },
      ],
  })

  export default lovelyCatsModel
  ```

  ...other files

  ---

  __Example2:__ 

  ---
  ```js
  // The template content is two files and their content.

  - ___componentName___.js    // file with variable in it's name
  - ___componentName___.css
  ```
  ---

* Template configuration file

  The name of template configuration file can be specified via the user settings filed `codeTemplateTool.configFile`. By default, it's `template.config.json`.

  The content of template configuration file should be a json object.

  __Example:__

  template.config.json
  ```json
  { 
      "name": "Template Example",
      "variables": [
          "{variable configuration}",
          "{variable configuration}",
          "..."
      ] 
  }
  ```


  * The `name` field specifies template's name showed in the template select list.

  * Variable configuration

    __Examples:__

    ```json
    // Simplified configuration 

    "variableName" // just a variable name string
    ```
   
    ```json
    // Full configuration

    {
        "name": "variableName", // required
        "defaultValue": "variableDefaultValue", // optional
        "style": { // optional
            // All fields of style are optional.
            "noTransformation": false,
            "keepUpperCase": false,
            "case": "camelCase",
            "prefix": "$$",
            "suffix": "___"
        }
    }
    ```

#### Variable rules

* A variable in template content is prefixed and suffixed with three underscores to distinguish from non variable content.

* Take `myPet` as an example of variable name, in template configuration files, you can use any of 
  `myPet, MyPet, my_pet, my-pet, My_Pet, MY_PET, My-Pet, MY-PET` 
  to represent any one of
  `___myPet___, ___MyPet___, ___my_pet___, ___my-pet___, ___My_Pet___, ___MY_PET___, ___My-Pet___ and ___MY-PET___`
   in corresponding template content.

  Actually, `myPet, MyPet, my_pet, my-pet, My_Pet, MY_PET, My-Pet, MY-PET` can be clearly separated into the same case ignore string list `["my", "pet"]`, so they are treated as the same variable with different styles.

* If __`style.noTransformation`__ is `true`,
The placeholders in template content will be replaced with the raw user input value.

* If __`style.keepUpperCase`__ is `true`,
uppercase words in user input will not be transformed to other cases,they will stay uppercase when joined with other words.

  __Example__

  | words              | transform to | keepUpperCase is false | keepUpperCase is true |  
  | ------------------ | ------------ | ---------------------- | --------------------- |  
  | "XML HTTP request" | pascalCase   | `XmlHttpRequest`       | `XMLHTTPRequest`      |  
  | "new customer ID"  | camelCase    | `newCustomerId`        | `newCustomerID`       |  

* Common transformation process of identifier styles

  * Any of the input variable values
  `lovelyCat, LovelyCat, LovelyCat, lovely_cat, Lovely_Cat, lovely-cat, Lovely-Cat, lovely cat, Lovely Cat`
  yields the same result in generated content.

  * If variable configuration is a string or it's __`style.case`__ field is `auto`, the actual `case` will be parsed from the corresponding placeholder.
  
    __Example:__

    ---
    Template content:

    ```js
    other content___MyPet___Other content
    other content ___myPet___ Other content
    other content ___my_pet___ Other content
    other content ___My_Pet___ Other content
    other content ___MY_PET___ Other content
    other content ___my-pet___ Other content
    other content ___My-Pet___ Other content
    other content ___MY-PET___ Other content
    ```
    ---
    Template configuration:

    ```json
    {
        "name": "Template Example",
        "variables": [
            {
                "name": "myPet",
                "style": {
                    "case": "auto"
                }
            }
        ]
    }
    ```
    or
    ```json
    {
        "name": "Template Example",
        "variables": ["myPet"]
    }
    ```
    ---
    Possible user inputs for the variable `myPet`:

    ```
    lovelyCat
    LovelyCat
    lovely_cat
    Lovely_cat
    LOVELY_CAT
    lovely-cat
    Lovely-Cat
    LOVELY-CAT
    lovely cat
    Lovely Cat
    LOVELY CAT
    ```
    ---
    Generated content:
    ```js
    other contentLovelyCatOther content
    other content lovelyCat Other content
    other content lovely_cat Other content
    other content Lovely_Cat Other content
    other content LOVELY_CAT Other content
    other content lovely-cat Other content
    other content Lovely-Cat Other content
    other content LOVELY-CAT Other content
    ```
    ---

  * After case transformation,  __`style.prefix`__ and __`style.suffix`__ will be added to the variable value.
  
    __Example__:
    
    Template content:
    
    ```js
    other content ___myPet___ other content
    ```

    Template config file:

    ```json
    {
        "name": "Template Example",
        "variables": [
            {
                "name": "myPet",
                "case": "pascalCase",
                "prefix": "__",
                "suffix": "$$",
            }
        ]
    }
    ```

    User input for the variable `myPet`: `lovely cat`

    Generated content:

    ```js
    other content __LovelyCat$$ other content
    ```


## Settings

* `codeTemplateTool.templatesPath`
  
  Only support absolute path. You can use `~/` to reference user home directory.

  Default: `~/.vscode/templates`

* `codeTemplateTool.configFile`

  Default: `template.config.json`

* `codeTemplateTool.encoding`

  Default: `utf8`

* `codeTemplateTool.ignore`

  An array of glob patterns. Files and folders that match one of the specified patterns will be ignored.

  Default: [".DS_Store"]

* `codeTemplateTool.variable.noTransformation`

  Control variable transformation globally. If set to true, raw user input will be used to replace the placeholders in template content.
  Can be overwritten by the `style.noTransformation` filed in variable configuration.

  Default: `false`  

* `codeTemplateTool.variable.keepUpperCase`

  If set to `true`, uppercase words in user input variable value will not be transformed to other cases. Can be overwritten by the `style.keepUpperCase` field in variable configuration.

  Default: `false`

## Known Issues

## Release Notes

### 0.1.0

* Initial release.

### 0.1.1

* Update docs.

### 0.1.2

* Change variable setter's title.

### 0.2.0

* Refactor project structure.
* Support prefix and suffix underscores.
* Support uppercase words in camel case and pascal case identifiers.

### 0.3.0

* Refactor project structure.
* Upgrade user interface. 
* Support modification of destination folder after select template.
* Support recursive creation of folders.
* Support custom configuration file name.
* Support custom encoding.
* Support glob pattern filter when read template file/folders.
* Support custom prefix and suffix.
* Support variable noTransformation globally and locally.
* Support variable keepUpperCase globally and locally.
* Move variable style features down to `style` field of variable configuration.
* Update docs.
