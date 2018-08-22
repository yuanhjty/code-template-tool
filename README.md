# code-template-tool README

A tool to generate codes based on templates.

## Usage

* Commands

  * template: Edit Templates
  
    Edit templates.

  * template: Reload Templates

    The command `template: Reload Templates` must be executed to get templates updates.

  * template: New File / Folder From Template

    Generate codes based on templates.

* Commands can be invoked via `command panel` (hit ⇧⌘P to open) or `context menu` (right-click to open).

## Concepts

* Target Directory (where generated codes is placed)
  
  * If invoke command `template: New File / Folder From Template` via command panel:

    * If there is active editor, target directory is the active editor's directory.

    * Else, target directory is the workspace directory.

  * If invoke command `template: New File / Folder From Template` via context menu:
    
    * If clicked item is a file, target directory is the file's directory.

    * If clicked item is a directory, target directory is the directory.
  

* Templates Directory

  ```js
  + $HOME/.vscode/templates/
    + oneTemplate/
      | - template.config.json
      | - templateFile_1.ext
      | - templateFile_2.ext
      | - templateFile_3.ext
      | - ...
      | - templateDirectory_1
      | - templateDirectory_2
      | - templateDirectory_3
      | - ...

    + anotherTemplate/
      | - template.config.json
      | - anotherTemplateFile_1.ext
      | - ...
  ```

* Templates Path

  All templates are organized in a root directory. The root directory is set as `$HOME/.vscode/templates` by default.

* Template's Parts 

  * Config file
  
    `template.config.json`

  * Main content
  
    The main content contains at least one file or directory.

* Variable (Placeholder)

  * Variables are supported in both file/directory name and file content of templates. They will be replaced with corresponding values set by users.
  
  * A variable takes three underscores as prefix and suffix. Eg: `___variable___`.
    
  * A variable could be camelCase (`___fooBar___`), pascalCase (`___FooBar___`), snakeCase (`___foo_bar___`) or hyphenCase (`___foo-bar___`). 
    
  * `___fooBar___`, `___FooBar___`, `___foo_bar___` and `___foo-bar___` are different styles of the same variable. They can be identified by any one of the identifiers `fooBar`, `FooBar`, `foo_bar` and `foo-bar` in the config file.

  * The code-template-tool will inference identifier style based on each variable, and convert the replacer to proper style.
    
    * variable identifier in config file: `fooBar`

      ```json
      // template.config.json

      { "name": "Template Example","variables": ["fooBar"] }
      ```

    * variable value set by user: `userInfo`

    * variable in templates and result in generated codes
    
      | variable in templates | result in generated codes |  
      | --------------------- | ------------------------- |  
      | `___fooBar___`        | useInfo                   |  
      | `___FooBar___`        | UserInfo                  |  
      | `___foo_bar___`       | user_info                 |  
      | `___foo-bar___`       | user-info                 |  

* Template Config File

  * Template config file is a json file named `template.config.json`.

  * The config object's fields:  

    * `name`: Template name that is displayed to users to choose template.

    * `variables`: An array of all variable names of a template.

## Settings

This extension contributes the following settings:

* `codeTemplateTool.templatesPath`: set templates path, absolute path support only. If not set, the default templates path is `$HOME/.vscode/templates`.

## Demo 

* Template

  ---
  ```js
  // template files

  + $HOME/.vscode/templates
    + demoTemplate 
      | - template.config.json
      | - common.js
      | - ___utilName___util.js
      | - ___config_name____config.js
      | - ___style-name___-style.scss
      + ___PageName___Page
        | - index.js
        | - ___pageName___Model.js
        | - ___pageName___Style.scss
        | - ___PageName___Page.js
  ```

  ---
  ```json
  // template.config.json

  {
      "name": "Demo Template",
      "variables": ["utilName", "configName", "styleName", "pageName"],
  }
  ```
  ---

  ```js
  // index.js

  import ___PageName___Page from './___PageName___Page'

  export ___PageName___Page
  ```
  ---

  ```js
  // ___pageName___Model.js

  import { createModel } from 'reduxModel'

  const ___pageName___Model = createModel({
      name: '___pageName___',
      ...
  })

  export default ___pageName___Model
  ```
  ---

  ```scss
  // ___pageName___Style.scss

  .___page-name___ {
    
  }
  ```
  ---

  ```js
  // ___PageName___Page.js

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
  ---

* Template variables' value ( set by user )

  variable | value 
   - | - 
  utilName | userInfo 
  configName | userHome
  styleName | userTheme
  pageName | myHome
  
* Generated codes

  ---
  ```js
  // generated files based on Demo Template

  // ___utilName___ => userInfo
  // ___config_name___ => user_home
  // ___style-name___ => user-theme
  // ___PageName___ => MyHome
  // ___pageName___ => myHome

  + targetDirectory
    | - common.js
    | - userInfoUtil.js
    | - user_home_config.js
    | - user-theme-style.scss
    + MyHomePage
      | - index.js
      | - myHomeModel.js
      | - myHomeStyle.scss
      | - MyHomePage.js
  ```
  ---

  ```js

  // ___PageName___ => MyHome

  // index.js

  import MyHomePage from './MyHomePage' 

  export MyHomePage
  ```
  ---

  ```js
  // ___pageName___ => myHome

  // myHomeModel.js

  import { createModel } from 'reduxModel'

  const myHomeModel = createModel({
      name: 'myHome',
      ...
  })

  export default myHomeModel 
  ```
  ---

  ```scss
  // ___pageName___ => myHome

  // myHomeStyle.scss

  .my-home {

  }
  ```
  ---

  ```js
  // ___PageName___ => MyHome
  // ___pageName___ => myHome
  // ___page-name___ => my-home

  //MyHomePage.js

  import React from 'react'
  import { connectModel } from 'reduxModel'
  import myHomeModel from './myHomeModel'
  import './myHomeStyle.scss'

  class MyHomePage extends React.Component {
      componentDidMount() {

      }

      render() {
          return (
              <div className="my-home">

              </div>
          )
      }
  }

  export default connectModel(myHomeModel, state => ({
      myHome: state.myHome,
  }))(MyHomePage)
  ```
  ---

## Known Issues

## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

Initial release
