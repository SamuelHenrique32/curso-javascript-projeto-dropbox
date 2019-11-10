class DropBoxController {

    constructor(){

        // Get by id
        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector('#react-snackbar-root');

        this.initEvents();
    }

    // Initialize events
    initEvents(){

        // Add event in button
        this.btnSendFileEl.addEventListener('click', event => {

            this.inputFilesEl.click();
        });

        // Add event in button
        this.inputFilesEl.addEventListener('change', event => {

            console.log(event.target.files);

            // Shows upload progress element by css
            this.snackModalEl.style.display = 'block';
        });
    }
}