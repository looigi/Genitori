import { Component, ElementRef, Input, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { VariabiliGlobali } from 'app/global.component';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'file-upload',
    templateUrl: 'file_upload.component.html'
})

export class FileUploadComponent implements OnInit {
    @Input() multiple;
    @Input() Arrotonda;
    @Input() Tipologia;
    @Input() id;
    @Input() Anno;
    @Input() Squadra;

    @Output() chiusuraMaschera = new EventEmitter<boolean>();
    @Output() aggiornaImm = new EventEmitter<string>();

    @ViewChild('fileInput', { static: false }) inputEl: ElementRef;

    webCamVisibile = false;
    attendiUpload = false;

    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
      // width: {ideal: 1024},
      // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];
    // latest snapshot
    public webcamImage: WebcamImage = null;
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  
    constructor(
        private http: Http, 
        private variabiliGlobali: VariabiliGlobali) {
    }

    ngOnInit(): void {
        WebcamUtil.getAvailableVideoInputs()
        .then((mediaDevices: MediaDeviceInfo[]) => {
          this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
        });  
    }
    
    upload(): void {
        const inputEl: HTMLInputElement = this.inputEl.nativeElement;
        const fileCount: number = inputEl.files.length;
        const formData = new FormData();
        if (fileCount > 0) { // a file was selected
          // console.log('Upload file: ', inputEl.files);
          let fileName = '';
          let Cartella = '';
          let mime = '';
          let estensione = '';
          const Squadra = this.variabiliGlobali.Squadra;

          for (let i = 0; i < fileCount; i++) {              
              formData.append('uploadFile', inputEl.files.item(i), inputEl.files.item(i).name);
              if (fileName.toUpperCase().indexOf('.MP4') > - 1)  {
                mime = 'video/mp4';
                estensione = '.mp4';                
              } else {
                mime = 'image/jpg';
                estensione = '.jpg'; // jpg';
              }
              if (this.Anno === true) {
                fileName = this.variabiliGlobali.Anno + '_' + this.id + estensione;
              } else {
                fileName = this.id + estensione;
              }
              Cartella = '';
          }

          formData.append('tipologia', this.Tipologia);
          formData.append('cartella', Cartella);
          formData.append('nomesquadra', Squadra);
          formData.append('arrotonda', this.Arrotonda);
          formData.append('uplodadedfile', fileName);
          formData.append('nomefile', fileName);
          formData.append('scrivelog', 'SI');

          const headers = new Headers();
          headers.append('Accept', 'application/json');

          const options = new RequestOptions({ headers: headers });

          this.http.post(this.variabiliGlobali.urlPerUpload, formData, options)
            .subscribe(
                data => {
                  this.chiusuraMaschera.emit(true);
                  this.variabiliGlobali.mostraMessaggio('File inviato con successo', false);
                },
                error => {
                  this.chiusuraMaschera.emit(false);
                  this.variabiliGlobali.mostraMessaggio('Errore nell\'invio', false);
                  // console.log(error);
                }
            );
      } else {
        this.chiusuraMaschera.emit(false);
        this.variabiliGlobali.mostraMessaggio('Selezionare un file', false);
      }
    }

    aggiornaImma(): void {
        this.aggiornaImm.emit(new Date().toString());
    }

    public handleInitError(error: WebcamInitError): void {
        if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
          console.warn('Camera access was not allowed by user!');
        }
      }
    
      apreWebCam(): void {
          this.webCamVisibile = true;
      }
    
      chiudiMascheraWC(): void {
        this.webCamVisibile = false;
      }
    
      public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
      }
    
      public showNextWebcam(directionOrDeviceId: boolean|string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
      }
    
      public handleImage(webcamImage: WebcamImage): void {
        // console.log('received webcam image', webcamImage);
        this.webcamImage = webcamImage;
        const im = this.dataURItoBlob(this.webcamImage['_imageAsDataUrl']);
        // console.log(im);
        this.uploadWC(im);
      }

      dataURItoBlob(dataURI): Blob {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            byteString = atob(dataURI.split(',')[1]);
        } else {
            byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type: mimeString});
      }

      public cameraWasSwitched(deviceId: string): void {
        // console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
      }
    
      public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
      }      

      uploadWC(im): void {
        // const inputEl: HTMLInputElement = this.inputEl.nativeElement;
        // const fileCount: number = inputEl.files.length;
        const formData = new FormData();
        // if (fileCount > 0) { // a file was selected
          // console.log('Upload file: ', inputEl.files);
        let fileName = '';
        let Cartella = '';
        let mime = '';
        let estensione = '';
        const Squadra = this.variabiliGlobali.Squadra;

          // for (let i = 0; i < fileCount; i++) {
        formData.append('uploadFile', im);
        // if (fileName.toUpperCase().indexOf('.MP4') > - 1)  {
        //     mime = 'video/mp4';
        //     estensione = '.mp4';
        // } else {
        mime = 'image/jpg';
        estensione = '.jpg';
        // }
        if (this.Anno === true) {
            fileName = this.variabiliGlobali.Anno + '_' + this.id + estensione;
        } else {
            fileName = this.id + estensione;
        }
        Cartella = '';
          // }
        
        formData.append('tipologia', this.Tipologia);
        formData.append('cartella', Cartella);
        formData.append('nomesquadra', Squadra);
        formData.append('arrotonda', this.Arrotonda);
        formData.append('uplodadedfile', fileName);
        formData.append('nomefile', fileName);
        formData.append('scrivelog', 'SI');

        // console.log(formData);

        const headers = new Headers();
        headers.append('Accept', 'application/json');

        const options = new RequestOptions({ headers: headers });

        this.http.post(this.variabiliGlobali.urlPerUpload, formData, options)
            .subscribe(
                data => {
                  this.chiusuraMaschera.emit(true);
                  this.variabiliGlobali.mostraMessaggio('File inviato con successo', false);
                },
                error => {
                  this.chiusuraMaschera.emit(false);
                  this.variabiliGlobali.mostraMessaggio('Errore nell\'invio', false);
                  // console.log(error);
                }
        );
      // } else {
      //   this.chiusuraMaschera.emit(false);
      //   alert ('Selezionare un file');
      // }
    }      
}
