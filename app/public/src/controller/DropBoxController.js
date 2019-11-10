import { rejects } from "assert";

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

            // Allow to send more than one file together
            this.uploadTask(event.target.files);

            // Shows upload progress element by css
            this.snackModalEl.style.display = 'block';
        });
    }

    uploadTask(files){

        // Each file has one promise
        let promises = [];

        // Spread to convert from collection to array
        [...files].forEach(file=>{
            promises.push(new Promise((resolve, reject)=>{

                // Ajax for each promise
                let ajax = new XMLHttpRequest();

                // Open connection
                ajax.open('POST', '/upload');

                // Verify valid JSON
                ajax.onload = event => {
                    
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    } catch(e){
                        reject(e);
                    }
                };

                ajax.onerror = event => {

                    reject(event);
                };

                // API
                let formData = new FormData();

                // Params: field to send, file
                formData.append('input-file', file);

                ajax.send(formData);
            }));
        });


        // Resolve if all files are OK, if one fails return reject
        return Promise.all(promises);
    }
}