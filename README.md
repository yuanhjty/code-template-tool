# Code Template Tool

Generate files/folders based on templates.

## What's new in 0.6.0

* Add the filed `allowExistingFolder` to template config.

  If `allowExistingFolder` is set to `true`, when trying to create a directory that is already existing, the existing directory will just be used.

  If set to `false` or not configured, when trying to create a existing directory, a `FileAlreadyExistsError` will be thrown.

## Features

* Template describes the shape of the file content as well as the folder structure.

* Destination folder path can be specified via right-click context or active editor, and be modified in user input interface.

* Folders that do not exist can be cerated recursively.

* Allow variables in file content as well as file/folder names.
  
* Support multiple identifier styles.

  * Case style

    <table>
      <thead>
        <tr> <th>Case</th> <th>Example</th> </tr>
      </thead>
      <tbody>
        <tr> <td>camelCase</td> <td><code>myLovelyCat</code></td> </tr>
        <tr> <td>pascalCase</td> <td><code>MyLovelyCat</code></td> </tr>
        <tr> <td>snakeCase</td> <td><code>my_lovely_cat</code></td> </tr>
        <tr> <td>kebabCase</td> <td><code>my-lovely-cat</code></td> </tr>
        <tr> <td>snakeUpperCase</td> <td><code>MY_LOVELY_CAT</code></td> </tr>
        <tr> <td>snakePascalCase</td> <td><code>My_Lovely_Cat</code></td> </tr>
        <tr> <td>kebabUpperCase</td> <td><code>MY-LOVELY-CAT</code></td> </tr>
        <tr> <td>kebabPascalCase</td> <td><code>My-Lovely-Cat</code></td> </tr>
        <tr> <td>upperCase</td> <td><code>MYLOVELYCAT</code></td> </tr>
        <tr> <td>lowerCase</td> <td><code>mylovelycat</code></td> </tr>
      </tbody>
    </table>

  * Prefix and suffix
  
    Identifiers can be prefixed or suffixed with any visible characters.

* Globally and template-level configuration of file encoding.

* Globally and template-level configuration of file ignorance list (glob pattern).

* Template-level configuration of processing mode for already existing directories.

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

```plaintext
+ exampleTemplate              // template define folder
  - template.config.json       // template configuration file
  - {other files and folders}  // template content
```

* Template content

  Template content support variables.

  By default, a variable in template content is like this: `___var___`. It takes `___` as it's left boundary and right boundary.
  
  You can set variables' boundaries via the `codeTemplateTool.variable.leftBoundary` and `codeTemplate.variable.rightBoundary` fields in user settings.

  For example, if you set `codeTemplateTool.variable.leftBoundary` to `{_` and `codeTemplateTool.variable.rightBoundary` to `_}`, a variable will be like `{_var_}`

  __Example1:__

  ---

  ```plaintext
  // The template content is a folder and what it contains.

  + ___PageName___Page        // folder with variable in it's name
    - index.js                // file with fixed name
    - ___PageName___Page.js   // file with variable in it's name
    - ___pageName___Page.css
    - ___pageName__Model.js
    + components              // sub folder with fixed name
  ```

  ___PageName___Page.js

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

  ___pageName___Model.js

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
  
  template.config.json

  ```js
  {
      "name": "Common Page Template",
      "variables": ["pageName", "initialStateType", "reducerType"]
  }
  ```

  or

  template.config.json

  ```js
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

  ```plaintext
  pageName: lovelyCats
  initialStateType: list
  reducerType: list
  ```

  _Then the generated content will be:_

  ```plaintext
  // Folder structure

  + LovelyCatsPage
    - index.js
    - LovelyCatsPage.js
    - lovelyCatsPage.css
    - lovelyCatsModel.js
    + components
  ```

  LovelyCatsPage.js

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

  lovelyCatsModel.js

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

  ```plaintext
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

  ```js
  {
      "name": "Template Example",
      "variables": [
          "{variable configuration}",
          "{variable configuration}",
          "..."
      ],
      "encoding": "utf8", // string, optional
      "ignore": ["{glob pattern}", "{glob pattern}", "..."], // array of string, optional
      "allowExistingFolder": false, // boolean, optional
  }
  ```

  * The `name` field specifies template's name showed in the template select list.

  * Variable configuration

    __Examples:__

    ```js
    // Simplified configuration

    "variableName" // just a variable name string
    ```

    ```js
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

  * The `encoding` filed specifies the encoding used when reading from template files and writing to target files. 
  
    If not configured, the filed `codeTemplateTool.encoding` in user settings will be used. Usually, it's `utf8`.

  * The `ignore` filed can be used to filter files/folders by glob patterns.

    The final ignore list is the merged result of the `ignore` filed configured here and the filed `codeTemplateTool.ignore` configured in user settings.

  * If the `allowExistingFolder` filed is set to `true`, when trying to create a directory that is already existing, the existing directory will just be used.

    If set to `false` or not configured, when trying to create a existing directory, a `FileAlreadyExistsError` will be thrown.

#### Variable rules

* A variable in template content has a left boundary and a right boundary to distinguish from non variable content. By default, variables' left boundary and right boundary are both `___`(three underscores).

  The boundary can be customized by setting the fields __`codeTemplateTool.variable.leftBoundary`__ and __`codeTemplateTool.variable.rightBoundary`__ in user settings.

* Take `myPet` as an example of variable name, in template configuration files, you can use any of
  `myPet, MyPet, my_pet, my-pet, My_Pet, MY_PET, My-Pet, MY-PET`
  to represent any one of
  `___myPet___, ___MyPet___, ___my_pet___, ___my-pet___, ___My_Pet___, ___MY_PET___, ___My-Pet___ and ___MY-PET___`
   in corresponding template content.

  Actually, `myPet, MyPet, my_pet, my-pet, My_Pet, MY_PET, My-Pet, MY-PET` can be clearly separated into the same case ignore string list `["my", "pet"]`, so they are treated as the same variable with different styles.

* Valid character sets for variables:

  * For variables' name: `a-zA-Z0-9`

  * For variable's value:

    * If __`style.noTransformation`__ is `true`: `a-zA-Z0-9`

    * Else: any characters

* If __`style.noTransformation`__ is `true`,
The placeholders in template content will be replaced with the raw user input value.

* If __`style.keepUpperCase`__ is `true`,
uppercase words in user input will not be transformed to other cases,they will stay uppercase when joined with other words.

  __Example__
  
  <table>
    <thead>
      <tr>
        <th>words</th>
        <th>transform to</th>
        <th>keepUpperCase is false</th>
        <th>keepUpperCase is true</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td>"XML HTTP request"</td>
            <td>pascalCase</td>
            <td><code>XmlHttpRequest</code></td>
            <td><code>XMLHTTPRequest</code></td>
        </tr>
        <tr>
            <td>"new customer ID"</td>
            <td>camelCase</td>
            <td><code>newCustomerId</code></td>
            <td><code>newCustomerID</code></td>
        </tr>
    </tbody>
  </table>

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

    ```js
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

    ```js
    {
        "name": "Template Example",
        "variables": ["myPet"]
    }
    ```

    ---
    Possible user inputs for the variable `myPet`:

    ```plaintext
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

    ```plaintext
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

    ```js
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

  _Default_: `~/.vscode/templates`
  
  Should be an local absolute path.

  Variables:

  * `{home}`: User home directory.

  * `{workspace}`: Your workspace directory. That is the directory currently open in your vscode instance.
    If no directory is open currently, `{workspace}` will be resolved as user home directory.
  
  You can also use `~/` to reference user home directory.

  Example:

  ```plaintext
  Your home dir: /users/superman
  Your current workspace: /users/superman/path/to/project

  {home}/.vscode/templates -> /users/superman/.vscode/templates
  {workspace}/templates    -> /users/superman/path/to/project/templates
  ~/.vscode/templates      -> /users/superman/.vscode/templates
  ```

* `codeTemplateTool.configFile`

  _Default_: `template.config.json`

* `codeTemplateTool.encoding`

  _Default_: `utf8`

* `codeTemplateTool.ignore`

  _Default_: `[".DS_Store"]`

  An array of glob patterns. Files and folders that match one of the specified patterns will be ignored.

* `codeTemplateTool.variable.noTransformation`

  _Default_: `false`  

  Control variable transformation globally. If set to true, raw user input will be used to replace the placeholders in template content.
  Can be overwritten by the `style.noTransformation` filed in variable configuration.

* `codeTemplateTool.variable.keepUpperCase`

  _Default_: `false`

  If set to `true`, uppercase words in user input variable value will not be transformed to other cases. Can be overwritten by the `style.keepUpperCase` field in variable configuration.

* `codeTemplateTool.variable.leftBoundary`

  _Default_: `___`

* `codeTemplateTool.variable.rightBoundary`

  _Default_: `___`

* `codeTemplateTool.userInput.confirmOnEnter`

  _Default_: `false`

  If set to `true`, you can press `Enter` key to confirm creation.

* `codeTemplateTool.userInput.cancelOnEscape`

  _Default_: `false`

  If set to `true`, you can press `ESC` key to cancel creation.

## Known Issues

## License

MIT
