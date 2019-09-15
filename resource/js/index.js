/* eslint-disable func-names */

(function() {
  top.vscode = acquireVsCodeApi();

  top.templateUserInput = {
    data: {
      templateName: '',
      variables: [],
      variableTable: new Map(),
      destDir: {
        basePath: '',
        relativePath: '',
      },
      inputConfig: {
        confirmOnEnter: false,
        cancelOnEscape: false,
      },
    },

    handleConfirm() {
      const { variables, variableTable } = this.data;

      const destDirBaseInputEl = document.querySelector('.user-input-dest-dir-base');
      const destDirRelativeInputEl = document.querySelector('.user-input-dest-dir-relative');
      const destDirBasePath = destDirBaseInputEl.value;
      const destDirRelativePath = destDirRelativeInputEl.value;

      const variableInputEls = document.querySelectorAll('.user-input-variable-value');
      variableInputEls.forEach(el => {
        const { id, value } = el;
        variableTable.set(id, value);
      });
      variables.forEach(variable => {
        const value = variableTable.get(variable.name);
        if (value) {
          variable.value = value;
        }
      });

      top.vscode.postMessage({
        variables,
        destDir: {
          basePath: destDirBasePath,
          relativePath: destDirRelativePath,
        },
      });
    },

    handleCancel() {
      top.vscode.postMessage('cancel');
    },

    render() {
      const { variables, destDir, variableTable, inputConfig, templateName } = this.data;

      const variableArr = Array.isArray(variables) ? variables : [];
      const variablesHTML = variableArr
        .map(
          ({ name }) =>
            `<div class="user-input-variable">
            <label class="user-input-variable-name">${name}: </label>
            <input class="user-input-variable-value" type="text" id=${name} placeholder="please input" />
        </div>`
        )
        .join('');

      const variablePanelHTML =
        variableArr.length > 0
          ? `
          <div class="user-input-panel">
              <h3 class="user-input-panel-title">Variables</h3>
              <div class="user-input-panel-content">
                  <div class="user-input-variables">
                      ${variablesHTML}
                  </div>
              </div>
          </div>`
          : '';

      const rootEl = document.getElementById('user-input-root');
      rootEl.innerHTML = `
                <h1 class="user-input-header">${templateName}</h1>
                <div class="user-input-content">
                    <div class="user-input-panel">
                        <h3 class="user-input-panel-title">Destination Directory</h3>
                        <div class="user-input-panel-content">
                            <div class="user-input-dest-dir">
                                <div class="user-input-dest-dir-item">
                                    <label class="user-input-dest-dir-label">Base(Workspace): </label>
                                    <input class="user-input-dest-dir-base" type="text" placeholder="please input" />
                                </div>
                                <div class="user-input-dest-dir-item">
                                    <label class="user-input-dest-dir-label">Relative: </label>
                                    <input class="user-input-dest-dir-relative" type="text" placeholder="please input" />
                                </div>
                            </div>
                        </div>
                    </div>
                    ${variablePanelHTML}
                </div>
                <div class="user-input-submit-btns">
                    <button class="user-input-confirm-btn">Confirm</button>
                    <button class="user-input-cancel-btn">Cancel</button>
                </div>`;

      const destDirBaseInputEl = document.querySelector('.user-input-dest-dir-base');
      const destDirRelativeInputEl = document.querySelector('.user-input-dest-dir-relative');
      destDirBaseInputEl.value = destDir.basePath || '';
      destDirRelativeInputEl.value = destDir.relativePath || './';

      const variableInputEls = document.querySelectorAll('.user-input-variable-value');
      variableInputEls.forEach(el => {
        el.value = variableTable.get(el.id);
      });

      const firstVariableInputEl = variableInputEls[0];
      if (firstVariableInputEl) {
        firstVariableInputEl.focus();
      }

      const confirmBtnEl = document.querySelector('.user-input-confirm-btn');
      const cancelBtnEl = document.querySelector('.user-input-cancel-btn');
      confirmBtnEl.addEventListener('click', this.handleConfirm.bind(this));
      cancelBtnEl.addEventListener('click', this.handleCancel.bind(this));
      rootEl.ownerDocument.addEventListener('keydown', e => {
        if (inputConfig.confirmOnEnter && e.key.toLowerCase() === 'enter') {
          this.handleConfirm();
        }
        if (inputConfig.cancelOnEscape && e.key.toLowerCase() === 'escape') {
          this.handleCancel();
        }
      });
    },

    start(userInputRequest) {
      const { variables, destDir, inputConfig, templateName } = userInputRequest;
      const { data } = this;
      const { variableTable } = data;

      data.templateName = templateName;
      data.variables = variables || [];
      data.destDir = destDir;
      data.variables.forEach(variable => {
        variableTable.set(variable.name, variable.value || '');
      });
      data.inputConfig = inputConfig;
      this.render();
    },
  };
})();
