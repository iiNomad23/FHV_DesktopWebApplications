window.onload = () => {

    document.getElementById("add-preset-button").addEventListener("click", function (){
        let preset = document.getElementById("add-preset-input").value;
        if(CppAPI.savePreset(preset)){
            insertPresetIntoTable([{"preset":preset}]);
        } else {
            CppAPI.consoleLog("Preset already exists");
        }

    });
    let presets = CppAPI.getAllPresets();
    insertPresetIntoTable(presets);
}

function insertPresetIntoTable(presets = []) {
    let presetsTableBody = document
        .getElementById("presets-table")
        .getElementsByTagName("tbody");

    for (let i = 0; i < presets.length; i++) {
        let preset = presets[i].preset;
        if (preset == null) {
            continue;
        }
        CppAPI.consoleLog(JSON.stringify(preset));
        presetsTableBody[0].innerHTML += `<tr id="${"row_" + preset}" class="hover">
                            <td></td>
                            <td>${preset}</td>
                            <td style="float: right">${getDeleteButtonHTML(preset)}</td>
                        </tr>`;
    }

    let deleteBtnEls = document.querySelectorAll('[id^="delete_"]');
    deleteBtnEls.forEach(function(deleteBtnEl) {
        deleteBtnEl.addEventListener("click", function (e) {
            CppAPI.consoleLog("delete button clicked");
            let preset = e.currentTarget.getAttribute('data-preset');
            if (CppAPI.deletePreset(preset)) {
                removeTableRow(preset);
            }
        });
    });
}

function removeTableRow(taskId) {
    let rowEl = document.getElementById("row_" + taskId);
    if (rowEl == null) {
        CppAPI.consoleLog("[root] Error removing table row!");
        return; // :(
    }

    rowEl.remove();
}


function getDeleteButtonHTML(preset) {
    return `<div class="flex flex-row items-center justify-between pr-3" role="group">
                <button id="${"delete_" + preset}" data-preset="${preset}" type="button" class="border-0 text-sm font-medium text-gray-500 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                        <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                    </svg>
                </button>
            </div>`;
}