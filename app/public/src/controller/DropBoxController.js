class DropBoxController {

    constructor(){

        // Get by id
        this.btnSendFileEl = document.querySelector("#btn-send-file");
        this.inputFilesEl = document.querySelector("#files");
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        // Search class
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.nameFileEl = this.snackModalEl.querySelector('.filename');
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft');

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

            this.modalShow();

            // Init to the next upload
            this.inputFilesEl.value = '';
        });
    }

    modalShow(show = true){

        // Shows upload progress element by css
        this.snackModalEl.style.display = (show) ? 'block' : 'none';
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

                    // Hide modal
                    this.modalShow(false);
                    
                    try{
                        resolve(JSON.parse(ajax.responseText));
                    } catch(e){
                        reject(e);
                    }
                };

                ajax.onerror = event => {

                    // Hide modal
                    this.modalShow(false);

                    reject(event);
                };

                // Generated multiple events in upload to calculate the progress bar
                ajax.upload.onprogress = event => {

                    this.uploadProgress(event, file);

                    //console.log(event);
                };

                // API
                let formData = new FormData();

                // Params: field to send, file
                formData.append('input-file', file);

                // Get current tick
                this.startUploadTime = Date.now();

                ajax.send(formData);
            }));
        });


        // Resolve if all files are OK, if one fails return reject
        return Promise.all(promises);
    }

    uploadProgress(event, file){

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded/total) * 100);
        let timeleft = ((100 - porcent)*timespent) / porcent;

        // Update css by template string
        this.progressBarEl.style.width = `${porcent}%`;

        this.nameFileEl.innerHTML = file.name;

        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);

        //console.log(timespent, timeleft, porcent);
    }

    // duration in ms
    formatTimeToHuman(duration){

        let seconds = parseInt((duration/1000) % 60);
        let minutes = parseInt((duration/(1000*60)) % 60);
        let hours = parseInt((duration/(1000*60*60)) % 24);

        // More than one hour
        if(hours){
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }

        if(minutes){
            return `${minutes} minutos e ${seconds} segundos`;
        }

        if(seconds){
            return `${seconds} segundos`;
        }

        // When it's very fast!
        return '';
        
    }


}