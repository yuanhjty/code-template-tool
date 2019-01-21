# 用户界面功能
* 配置 - 使用 VSCode 提供的配置界面进行配置
* 获得模板
  * 自定义模板(添加、编辑) - template: Edit Templates
  * 导入本地模板 - template: Import Templates
  * 从 GitHub 在线导入模板 - template: Download Templates
* 选择模板 - template: New File / Folder From Template
* 设置模板参数 - 表单输入
* 确认/取消生成目标代码 - 确认/取消按钮

# 实现
## 用户层接口
* Command
  * EditTemplates
  * ImportTemplates
  * DownloadTemplates
  * NewFileFromTemplates
  * ChooseTemplate
  * ConfirmCreation
  * CancelCreation
* GUI: Webview

## 资源
### 静态资源
  * Config
  * Templates
  * Workspace
  * WebviewPage 

### 动态资源
  * VSCodeContext
    * ActiveEditor
    * TargetPath
  * TemplatesTable
  * ActiveTemplat
    * TemplateMeta

## Utils
* Tips
  * Info
  * Error
  * Warning
* IdentifierParser
* PathResolver
* FileAsyncAPI

## enums
* IdentifierStyles
