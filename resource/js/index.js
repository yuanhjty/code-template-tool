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
                }
            });
        },

        handleCancel() {
            top.vscode.postMessage('cancel');
        },

        render() {
            const { variables, destDir, variableTable, templateName } = this.data;

            const variablesHTML = (Array.isArray(variables) ? variables : [])
                .map(
                    ({ name }) => `
                        <div class="user-input-variable">
                            <label class="user-input-variable-name">${name}: </label>
                            <input class="user-input-variable-value" type="text" id=${name} placeholder="please input" />
                        </div>`
                )
                .join('');

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
                    <div class="user-input-panel">
                        <h3 class="user-input-panel-title">Variables</h3>
                        <div class="user-input-panel-content">
                            <div class="user-input-variables">
                                ${variablesHTML}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-input-submit-btns">
                    <div class="user-input-confirm-btn">Confirm</div>
                    <div class="user-input-cancel-btn">Cancel</div>
                </div>`;

            const destDirBaseInputEl = document.querySelector('.user-input-dest-dir-base');
            const destDirRelativeInputEl = document.querySelector('.user-input-dest-dir-relative');
            destDirBaseInputEl.value = destDir.basePath || '';
            destDirRelativeInputEl.value = destDir.relativePath || '.';

            const variableInputEls = document.querySelectorAll('.user-input-variable-value');
            variableInputEls.forEach(el => {
                el.value = variableTable.get(el.id);
            });

            const confirmBtnEl = document.querySelector('.user-input-confirm-btn');
            const cancelBtnEl = document.querySelector('.user-input-cancel-btn');
            confirmBtnEl.addEventListener('click', this.handleConfirm.bind(this));
            cancelBtnEl.addEventListener('click', this.handleCancel.bind(this));
        },

        start(userInputRequest) {
            const { variables, destDir, templateName } = userInputRequest;

            this.data.templateName = templateName;
            this.data.variables = variables || [];
            this.data.destDir = destDir;
            this.data.variables.forEach(variable => {
                this.data.variableTable.set(variable.name, variable.value || '');
            });
            this.render();
        },
    };
})();
