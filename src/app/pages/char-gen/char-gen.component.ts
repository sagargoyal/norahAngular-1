import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Component, OnInit, OnChanges, SimpleChange, SimpleChanges, AfterViewInit, HostListener, trigger, state, animate, transition, style, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Http,Headers } from '@angular/http';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { NouiFormatter } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from './SocketService';
import { GeneratedImages ,DefaultInputValues } from './data-model';
import { GlobalRef } from '../../global-ref';
import {  AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';



declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-char-gen',
  templateUrl: './char-gen.component.html',
  styleUrls: ['./char-gen.component.css'],
 // encapsulation: ViewEncapsulation.None,
  providers: [SocketService]
})

export class CharGenComponent implements OnInit,OnChanges,AfterViewInit {

  public hideFooter = false;
  public inputRes: any;
  public outputRes: any;
  public sanitizedInput: any;
  public sanitizedOutput: any;
  public inputBaseParam: any;
  public inputHeight: any;
  public inputWeight: any;
  public inputAsian: any;
  public inputAfrican: any;
  public inputCaucasian: any;
  public inputSex: any;
  public outputBaseParam: any;
  public outputHeight: any;
  public outputWeight: any;
  public outputAsian: any;
  public outputAfrican: any;
  public outputCaucasian: any;
  public outputSex: any;
  public inputUrl = "assets/data/input.json";
  public OutputUrl = "assets/data/output.json";
  private FileUploadId: any;
  private processedFiles: GeneratedImages = new GeneratedImages("","","",["","","","",""]);
  private mergedFiles: GeneratedImages = new GeneratedImages("","","",["","","","",""]);
  private selectedImage1: any = { file: "assets/images/object-2.png" };
  private selectedImage2: any = { file: ""};
  private selectedImage3: any = { file: ""};
  private input1Image: any = { file:"" };
  private input2Image: any = { file:"" };
  private bodyParts: any = [];
  private selectedBodyPart: any;
  private changeHistoryG: Array<GeneratedImages> = [];
  private changeHistoryM: Array<GeneratedImages> = [];
  private bodyPartImage: any = "assets/images/human/human.png";
  private oldEthinicVal = {
    asian:[6, 2],
    african: [3, 3],
    caucasian: [1, 5],
  };
  public BaseParams: number[] = [0, 10];
  public Height: number[] = [0, 10];
  public Weight: number[] = [0, 10];
  public Muscle: number[] = [0, 10];
  public Proportion: number[] = [0, 10];
  public Asian: number[] = [6, 8];
  public African: number[] = [3, 7];
  public Caucasian: number[] = [1, 5];
  public Sex: number[] = [0, 10];
  public Age: number[] = [0, 10];
  private ethnicity: number[] = [4,6];
  public someMin = 1;
  public someLimit = 50;
  public someValue = [ 2, 10 ];
  public someRange = [ 2, 10 ];
  public someRange2config: any = {
    behaviour: 'drag',
    connect: true,
    margin: 1,
    limit: 5, // NOTE: overwritten by [limit]="10"
    range: {
      min: 0,
      max: 20
    },
    pips: {
      mode: 'steps',
      density: 5
    }
  };

  public someKeyboardConfig: any = {
    behaviour: 'drag',
    connect: true,
    start: [0, 9],
    keyboard: true,  // same as [keyboard]="true"
    step: 0.1,
    pageSteps: 10,  // number of page steps, defaults to 10
    range: {
      min: 0,
      max: 10
     },
    pips: {
      mode: 'count',
      density: 1,
      values: 1,
      stepped: true
    }
  };
  public ethinicityConfig: any = {
    behaviour: 'drag',
    connect: [true,true,true],
    start:[4,6,],
    margin: 1,
    keyboard: true,  // same as [keyboard]="true"
    step: 0.1,
    pageSteps: 10,
    range: {
      min: 0,
      max: 10
    },
    pips: {
      mode: 'count',
      density: 1,
      values: 1,
      stepped: true
    }
  };
  public toastr: any;
  public serverReady: boolean = false;
  private generationCount = 0;
  private mergeCount = 0;

  public config: SwiperConfigInterface = {
    scrollbar: '.swiper-scrollbar',
    direction: 'horizontal',
    slidesPerView: 'auto',
    scrollbarHide: false,
    keyboardControl: true,
    mousewheelControl: true,
    scrollbarDraggable: true,
    scrollbarSnapOnRelease: true,
    pagination: null,//'.swiper-pagination',
    paginationClickable: true,
    nextButton: null,//.swiper-button-next',
    prevButton: null,//'.swiper-button-prev'
    spaceBetween: 15,
  };

  constructor(
    private _http: Http,
    private sanitizer: DomSanitizer,
    private socket: SocketService,
    private global: GlobalRef,
    private firebaseAuth: AngularFireAuth,
    private firebaseDb: AngularFireDatabase){
    const wnd = this.global.nativeGlobal;
    this.toastr = wnd.toastr;

    // this.getInput();
    // this.getOutput();

  }

  ngOnChanges(changes: SimpleChanges) {
    
    console.log("change");

  }
  
  ngOnInit() {
    
    $(function() {
      setTimeout(function(){
        $(".expand").trigger('click');
      },500);
      $(".expand").on("click", function() {
        $(this).next().slideToggle(200);
        var $expand = $(this).find(">:first-child");

        if($expand.text() == "▼") {
          $expand.text("►");
        } else {
          $expand.text("▼");
        }
      });
    });
    
    this.socket.on('files',(data) => {
      console.log("Socket Data Received: ");

      // console.log(data, data.generationName[0] === "G");

      //if(data.id==this.FileUploadId){

      this.showMessag("Files successfully processed");
      if(data.generationName[0] === "G"){

        this.processedFiles = new GeneratedImages(data.id,data.generationName,"",data.files);
        this.selectedImage1 = Object.assign({}, data.files[0]);
        this.input1Image = Object.assign({}, this.selectedImage1);
        this.changeHistoryG.push(this.processedFiles);
      } else {
        if(data.generationName[0] === "M"){
          this.mergedFiles = new GeneratedImages(data.id,data.generationName,"",data.files);
          this.selectedImage2 = Object.assign({}, data.files[0]);
          this.selectedImage1.file = '';
          this.selectedImage3.file = '';
          this.changeHistoryM.push(this.mergedFiles);
        }
      }      

      //files received
      //load them in the component

    });

    this.socket.on("info",(data) => {
      console.log("info from server");
      console.log(data);
      this.showMessag(data.msg);
    });

    this.socket.on('errorInfo',(data) => {
      console.log("Socket Error Data Received: ");
      console.log(data);

      //if(data.id==this.FileUploadId)

      this.showMessag(data.msg);
    });

    this.socket.on('repo',(data) => {
      console.log("Body parts received..");;
      console.log(data);
      this.bodyParts = data;
    });
//get repo
    this.socket.emit("repo",{part:""});
    
    this.socket.on("exportModel",(data) => {

      //export fbx

      console.log("model received");
      console.log(data);
      if(data) {
        var link = document.createElement("a");
        link.download = "a";
        link.href = data.files[0];
        document.body.appendChild(link);
        link.click();
      }
    });

    this.socket.on("addToGame",(data) => {

      //export fbx

      console.log("model received");
      console.log(data);
      if(data) {

        // link.href = data.files[0];

        var request = new XMLHttpRequest();
        request.open('GET', data.files[0], true);
        request.responseType = 'blob';
        request.send(null);
        this.toastr.info("preparing files to upload");
        request.onerror = (e: ErrorEvent)=>{
          this.toastr.error("Failed to process file");
        };
        request.onreadystatechange =  ()=> {
          if (request.readyState === 4 && request.status === 200) {

            //console.log(request.response);

            var fbxFile = request.response;

            //this.addToGame(request.response);

            var request2 = new XMLHttpRequest();
            request2.open('GET', this.selectedImage1.file, true);
            request2.responseType = 'blob';
            request2.send(null);
            request2.onreadystatechange = () => {
              if (request2.readyState === 4 && request2.status === 200) {
                this.addToGame(fbxFile,request2.response);
              } else {

                //this.toastr.error("failed to add model Image to the library");

              }
            }
          } else {

            //this.toastr.error("failed to add model to the library");

          }
        }

        //this.addToGame(data.files[0]);

      }
    });

    this.socket.on("serverReady",(data) => {
      setTimeout(() => {
        this.serverReady = true;
        this.showMessag("Server is ready now");
      },10000);
    });

  }

  switchImage(id: string, pos: string) {
    if(pos === "G"){
      console.log("Switching image to:" +id);
      this.changeHistoryG = this.changeHistoryG.map((gen) => {
        if(gen.id == id){
          gen.setActive();
          this.processedFiles = gen;
          this.selectedImage1 = Object.assign({}, gen.files[0]);
          this.input1Image = Object.assign({}, this.selectedImage1);
          this.selectedImage2.file = '';
          this.selectedImage3.file = '';
          gen.setActive(false);
        }
        return gen;
      });
    } else {
      if (pos === "M") {
        console.log("Switching image to:" +id);
        this.changeHistoryM = this.changeHistoryM.map((gen) => {
          if(gen.id == id){
            gen.setActive();
            this.mergedFiles = gen;
            this.selectedImage2 = Object.assign({}, gen.files[0]);
            this.input1Image = Object.assign({}, this.selectedImage2);
            this.selectedImage3.file = '';
            this.selectedImage1.file = '';
            gen.setActive(false);
          }
          return gen;
        });
      }
    }
  }

  generateImage() {

    if(this.processedFiles.id !== "" && this.selectedBodyPart) {
      this.merge();
    } else {

      //generate generation 1

      this.saveRanges(null);
    }

  }

  showMessag(msg: string) {

    this.toastr.info(msg);

  }
  
  // undo(pos: string) {

  //   //undo last changes
  //   if (pos === "G") {
  //     if(this.changeHistoryG.length > 0) {
  //       this.processedFiles = this.changeHistoryG.pop();
  //       this.selectedImage1 = this.processedFiles[0];
  //       this.input1Image = Object.assign({}, this.selectedImage1);
  //     }
  //   } else {
  //     if(this.changeHistoryM.length > 0) {
  //       this.mergedFiles = this.changeHistoryM.pop();
  //       this.selectedImage1 = this.mergedFiles[0];
  //       this.input1Image = this.mergedFiles[0];
  //     }
  //   }

  // }

  merge() {

    //input.json from selected Image

    if(!this.serverReady) {
      this.showMessag("Server is not ready.Please wait for few seconds");
      return;
    }

    if( !this.selectedImage1 && !this.selectedBodyPart ) {
      this.showMessag("Please select an Image template and body part to merge");
      return;
    }

    let inputVal = Object.assign({}, this.selectedImage1);

    for(var attr in this.selectedBodyPart){
      if(inputVal[attr]) {

        //Blank Code Detected. Check for possible Error.

      } else {
        inputVal[attr] = 0;
      }
    }

    let outputVal = Object.assign({}, this.selectedImage1, this.selectedBodyPart);

    delete outputVal.file;

    delete inputVal.file;

    console.log(inputVal);
    console.log(outputVal);
    const inputjson = JSON.stringify(inputVal);
    const outputjson = JSON.stringify(outputVal);

    //send via socket
    this.mergeCount++
    // this.sendValues(inputVal,outputVal,"Merge: " + this.bodyParts.part);
    this.sendValues(inputVal, outputVal, "Merge " + this.mergeCount);
  }
 
  imageSelected(index: number, pos: string){
    try {
      if (pos === "G" && this.processedFiles.files[index] !== '') { 
        this.selectedImage1 = Object.assign({}, this.processedFiles.files[index]);
        this.input1Image = Object.assign({}, this.selectedImage1);
        if (this.selectedImage3.file === "" && this.selectedImage2.file !== "") {
          this.input2Image = Object.assign({}, this.selectedImage2);
        }
        if (this.selectedImage3.file !== "" && this.selectedImage2.file !== "") {
          this.selectedImage2.file = "";
        }
      } else {
        if (pos === "M" && this.mergedFiles.files[index] !== '') { 
          this.selectedImage2 = Object.assign({}, this.mergedFiles.files[index]);
          // this.input1Image = Object.assign({}, this.selectedImage2);
        }
      }
    } catch(ex) {

      //Error Handling to be implemented.

    }

  }

  scrollLeft() {

    var view = $(".scroller-content");
    var move = "250px";
    var sliderLimit = -250;
    
    var currentPosition = parseInt(view.css("left"));
    if (currentPosition < 0) view.stop(false,true).animate({left: "+=" + move},{ duration: 400});

  }

  scrollRight(){

    var view = $(".scroller-content");
    var move = "250px";
    var sliderLimit = -250;

    var currentPosition = parseInt(view.css("left"));
    if (currentPosition >= sliderLimit) view.stop(false,true).animate({left: "-=" + move},{ duration: 400})

  }

  saveBaseParamRange(slider,value,sobj) {

    console.log('Value of slider ' + slider + ' changed to', value);
    console.log(sobj);
    if (slider == "asian") {
      let dx1 = value[0] - this.oldEthinicVal.asian[0];
      let dx2 = value[1] - this.oldEthinicVal.asian[1];

      this.oldEthinicVal.asian = value;
      let val: any = [this.Caucasian[0] - (dx1 / 2.0), this.Caucasian[1] - (dx2 / 2.0)];

      this.Caucasian=val;
      let val2: any = [this.African[0] - (dx1 / 2.0), this.African[1] - (dx2 / 2.0)];

      this.African = val;
    }
    if (slider == "african") {

      let dx1 = value[0] - this.oldEthinicVal.african[0];

      let dx2 = value[1] - this.oldEthinicVal.african[1];
      this.oldEthinicVal.african = value;

      let val: any = [this.Caucasian[0] - (dx1 / 2.0), this.Caucasian[1] - (dx2 / 2.0)];
      this.Caucasian = val;
      let val2: any = [this.Asian[0] - (dx1 / 2.0), this.Asian[1] - (dx2 / 2.0)];
      this.Asian = val;
    }

    if (slider == "caucasian") {
      let dx1 = value[0] - this.oldEthinicVal.caucasian[0];

      let dx2 = value[1] - this.oldEthinicVal.caucasian[1];
      this.oldEthinicVal.caucasian = value;

      let val: any = [this.African[0] - (dx1 / 2.0), this.African[1] - (dx2 / 2.0)];
      this.African = val;

      let val2: any = [this.Asian[0] - (dx1 / 2.0), this.Asian[1] - (dx2 / 2.0)];
      this.Asian = val;
    }
  }

  saveRanges(saveRange:NgForm) {

    if(!this.serverReady) {
      this.showMessag("Server is not ready.Please wait for few seconds");
      return;
    }

    this.generationCount++;

      /*
      this.inputRes = {
        "macrodetails/Age": this.Age[0]/10,
        "macrodetails-height/Height": this.Height[0]/10,
        "macrodetails/Gender": this.Sex[0]/10,
        "macrodetails-universal/Weight": this.Weight[0]/10,
        "macrodetails-proportions/BodyProportions":this.Proportion[0]/10,
        "macrodetails-universal/Muscle":this.Muscle[0]/10,
        "macrodetails/Asian": this.Asian[0]/10,
        "macrodetails/African": this.African[0]/10,
        "macrodetails/Caucasian": this.Caucasian[0]/10
      }

      this.outputRes = {
        "macrodetails/Age": this.Age[1]/10,
        "macrodetails-height/Height": this.Height[1]/10,
        "macrodetails/Gender": this.Sex[1]/10,
        "macrodetails-universal/Weight": this.Weight[1]/10,
        "macrodetails-proportions/BodyProportions":this.Proportion[1]/10,
        "macrodetails-universal/Muscle":this.Muscle[1]/10,
        "macrodetails/Asian": this.Asian[1]/10,
        "macrodetails/African": this.African[1]/10,
        "macrodetails/Caucasian": this.Caucasian[1]/10
      }*/


    this.inputRes = {
      "macrodetails/Age": this.Age[0]/10,
      "macrodetails-height/Height": this.Height[0]/10,
      "macrodetails/Gender": this.Sex[0]/10,
      "macrodetails-universal/Weight": this.Weight[0]/10,
      "macrodetails-proportions/BodyProportions":this.Proportion[0]/10,
      "macrodetails-universal/Muscle":this.Muscle[0]/10,
      "macrodetails/Asian": this.ethnicity[0]/10,
      "macrodetails/African": (this.ethnicity[1] - this.ethnicity[0])/10,
      "macrodetails/Caucasian": (10 - this.ethnicity[1])/10
    }

    this.outputRes = {
      "macrodetails/Age": this.Age[1]/10,
      "macrodetails-height/Height": this.Height[1]/10,
      "macrodetails/Gender": this.Sex[1]/10,
      "macrodetails-universal/Weight": this.Weight[1]/10,
      "macrodetails-proportions/BodyProportions":this.Proportion[1]/10,
      "macrodetails-universal/Muscle":this.Muscle[1]/10,
      "macrodetails/Asian": this.ethnicity[0]/10,
      "macrodetails/African": (this.ethnicity[1] - this.ethnicity[0])/10,
      "macrodetails/Caucasian": (10 - this.ethnicity[1])/10
    }
     
    for(var attr in DefaultInputValues) {
      if(this.inputRes[attr]){

        //   console.log("found "+attr)

      } else {

        //console.log("not found "+attr);

        this.inputRes[attr] = DefaultInputValues[attr];
        this.outputRes[attr] = DefaultInputValues[attr];
      }
    }

    console.log(this.inputRes);
    console.log(this.outputRes);
    this.sendValues(this.inputRes, this.outputRes, "Generation " + this.generationCount);

    const inputjson = JSON.stringify(this.inputRes);
    const outputjson = JSON.stringify(this.outputRes);
    var blobinput = new Blob([inputjson], {type: "application/json"});
    var bloboutput = new Blob([outputjson], {type: "application/json"});

    let form: FormData = new FormData();
    form.append("input",blobinput, "input.json");
    form.append("output",bloboutput, "output.json");

    //let headers = new Headers({ 'Content-Type': 'application/json' });

    let headers = new Headers({enctype:'multipart/form-data'});
    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          console.log("sUCCESS");
          var d = JSON.parse(request.response);
          console.log(d);

          // this.toaster.pop('success',"Char maker ","Files successfully uploaded  ID:"+d.id );

          this.FileUploadId = d.id;
          this.showMessag("Files successfully uploaded  ID:" + d.id);
        } else {
          console.log("fAILED");
          this.showMessag("Failed to upload Files");

          //this.toaster.pop('error',"Char maker ","Failed to upload Files");

          console.log(request.response);
        }
      }
    }

    /*request.open(
                "POST",
                "http://localhost:8080/upload"  //replace with the target server which is handling uploads
                //"http://130.211.167.206:2000/upload"
               // "http://192.168.1.114:3000/users/abc"
      ,true
              );
      */
    //request.send(form);

  }

  sendValues(inputValues, outputValues, genrationName) {

    this.socket.emit("upload",{inputValues:inputValues, outputValues:outputValues, generationName:genrationName}, (err) => {
      console.log("upload request sent");
      console.log(err);
    });

  }

  showFace: boolean = false;

  bodyPartTypeSelected(part: string) {

    //fetch the requestd body part

    console.log("fecthcing parts: " + part);
    if(part == "face") {
      this.showFace = true;
      part = "cheek";
    } else {
      this.showFace = false;
      this.bodyPartImage = `assets/images/human/${part}.png`; //Please Recheck this function. Suspected Ambiguity.
    }
    this.socket.emit("bodyPart",{part:part});

  }

  facePartTypeSelected(part:string){

    //fetch the requestd body part

    console.log("fecthcing parts: " + part);
    this.bodyPartImage = `assets/images/human/${part}.png`;
    this.socket.emit("bodyPart",{part:part});

  }

  bodyPartSelected(index: number){

    try{
      this.selectedBodyPart = Object.assign({}, this.bodyParts.files[index]);
      this.selectedImage3 = Object.assign({}, this.selectedBodyPart);
      this.input2Image = Object.assign({}, this.selectedImage3);
      if (this.selectedImage1.file === "" && this.selectedImage2.file !== "") {
        this.input1Image = Object.assign({}, this.selectedImage2);
      }
      if (this.selectedImage1.file !== "" && this.selectedImage2.file !== "") {
        this.selectedImage2.file = "";
      }
    } catch(ex) {
      //Missing Error Handling
    }

  }

  errorHandler(error: Response) {

    console.error(error);
    return Observable.throw(error || "Server error");

  }

  onChange(value: any) {

    console.log('Value changed to', value);

  }

  exportFbx(addToGame: boolean = false) {

    //input.json from selected Image

    if(!this.serverReady) {
      this.showMessag("Server is not ready.Please wait for few seconds");
      return;
    }
    if( !this.processedFiles) {
      this.showMessag("Please generate model to export");
      return;
    }
    let inputVal = Object.assign({}, this.selectedImage1);
    delete inputVal.file;
    console.log(inputVal);
    console.log("addtogame" + addToGame);

    //send via socket

    if(addToGame) {
      this.socket.emit("exportModel", {inputValues: inputVal, addToGame: addToGame});
    } else {
      this.socket.emit("exportModel", {inputValues: inputVal});
    }
  }

  ngAfterViewInit(){}

  /*@HostListener('document:keydown', ['$event'])
  changeImage(event: KeyboardEvent) {
    if(this.processedFiles){
      if(event.keyCode == 38) {

        //left arrow
        
        let index = this.processedFiles.files.findIndex((x) => x.file == this.selectedImage1.file)
        if(index != 0) {
          this.selectedImage1 = this.processedFiles.files[index - 1];
          this.input1Image = this.selectedImage1;
        }
      }
    }
    if(event.keyCode == 40) {

      //rightarrow

      let index = this.processedFiles.files.findIndex((x) => x.file == this.selectedImage1.file)
      if(index != this.processedFiles.files.length - 1) {
        this.selectedImage1 = this.processedFiles.files[index + 1];
        this.input1Image = this.selectedImage1;
      }
    }
  }*/

  addToGame(fbxfile, imageFile) {

    const wnd = this.global.nativeGlobal;
    const toastr = wnd.toastr;
    if(!firebase.auth().currentUser) {
      toastr.error("Please log in to continue");
      return;
    }
    var newObjRef= firebase.database()
      .ref('usernames')
      .child(firebase.auth().currentUser.uid)
      .child('gameLibrary')
      .child('charModels').push();

    var filename = newObjRef.key + ".fbx";
    var imageFilename = newObjRef.key + ".png";
    toastr.info("Uploading file to storage");
    firebase.storage().ref('/gameLibrary/charModels').child(`${filename}`).put(fbxfile).then((snapshot) => {
      console.log(snapshot);
      var obj = {
        modelLink: snapshot.downloadURL,
        modelRef: snapshot.ref.fullPath
      };
      console.log(obj);
      firebase.storage().ref('/gameLibrary/charModels').child(`${imageFilename}`).put(imageFile).then((snapshot) => {
        obj["imageLink"] = snapshot.downloadURL;
        obj["imageRef"] = snapshot.ref.fullPath;
        newObjRef.set(obj).then((d) => {
          console.log(d);
          toastr.info("File has been added to library.");
        });
      });
    });
  }
}

