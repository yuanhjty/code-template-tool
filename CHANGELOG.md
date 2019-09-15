# Change Log

## [Unreleased]

## [0.6.1] - 2019-03-06

### Fixed

- Fix docs typo.

## [0.6.0] - 2019-03-06

### Added

- Template config filed: `allowExistingFolder`.

## [0.5.1]

### Fixed

- Fix the issue that template list has no fixed sort.
- Update docs.

## [0.5.0]

### Added

- Add variables for the user settings field `templatesPath`: `{home}`, `{workspace}`.
- New user settings: `codeTemplateTool.userInput.confirmOnEnter`, `codeTemplateTool.userInput.cancelOnEscape`.

### Changed

- Skip select step when there is only one template.
- Autofocus on variable input box.
- Focus on buttons by tab key and trigger by enter key.

## [0.4.0]

### Added

- New user settings: `codeTemplateTool.variable.leftBoundary`, `codeTemplateTool.variable.rightBoundary`.

### Fixed

- Fix the issue that the additional underscores are replaced.

## [0.3.0]

### Added

- Support modification of destination folder after select template.
- Support recursive creation of folders.
- Support custom configuration file name.
- Support custom encoding.
- Support glob pattern filter when read template file/folders.
- Support custom prefix and suffix.
- Support variable noTransformation globally and locally.
- Support variable keepUpperCase globally and locally.

### Changed

- Refactor project structure.
- Upgrade user interface.
- Move variable style features down to `style` field of variable configuration.
- Update docs.

## [0.2.0]

### Added

- Support prefix and suffix underscores.
- Support uppercase words in camel case and pascal case identifiers.

### Changed

- Refactor project structure.

## [0.1.2]

### Changed

- Change variable setter's title.

## [0.1.1]

### Fixed

- Update docs.

## [0.1.0]

### Added

- Initial release.
