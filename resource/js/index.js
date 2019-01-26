(function() {
    top.vscode = acquireVsCodeApi();

    top.templateUserInput = {
        data: {
            variables: [],
            variableTable: new Map(),
            destDirPath: undefined,
        },

        handleConfirm() {
            const { variables, variableTable } = this.data;

            const destDirInputEl = document.querySelector('.user-input-dest-dir-value');
            const destDirPath = destDirInputEl.value;

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

            top.vscode.postMessage({ variables, destDirPath });
        },

        handleCancel() {
            top.vscode.postMessage('cancel');
        },

        render() {
            const { variables, destDirPath, variableTable } = this.data;

            const variablesHTML = (Array.isArray(variables) ? variables : [])
                .map(
                    ({ name }) => `
                        <div class="user-input-variable">
                            <label class="user-input-variable-name">${name}</label>
                            <input class="user-input-variable-value" type="text" id=${name} />
                        </div>`
                )
                .join('');

            const rootEl = document.getElementById('user-input-root');
            rootEl.innerHTML = `
                <div class="user-input-content">
                    <div class="user-input-dest-dir">
                        <div class="user-input-dest-dir-label">Destination Directory Path</div>
                        <input class="user-input-dest-dir-value" type="text" />
                    </div>
                    <div class="user-input-variables">
                        ${variablesHTML}
                    </div>
                </div>
                <div class="user-input-submit-btns">
                    <div class="user-input-confirm-btn">Confirm</div>
                    <div class="user-input-cancel-btn">Cancel</div>
                </div>`;

            const destDirInputEl = document.querySelector('.user-input-dest-dir-value');
            destDirInputEl.value = destDirPath || '';

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
            const { variables, destDirPath } = userInputRequest;
            this.data.variables = variables || [];
            this.data.destDirPath = destDirPath || '';
            this.data.variables.forEach(variable => {
                this.data.variableTable.set(variable.name, variable.value || '');
            });
            this.render();
        },
    };
})();
