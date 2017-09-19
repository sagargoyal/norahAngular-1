import {Inject, Injectable} from '@angular/core';
import { FirebaseApp } from 'angularfire2/angularfire2';
import * as firebase from 'firebase';
import { GlobalRef } from '../../global-ref';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FileLoader } from 'three';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class GunInterpService {

  private terrainsArr: number[] = [1, 2, 3, 4, 5];
  user: any;
  private receivedData = [];
  private currentUser:BehaviorSubject<any>;
  constructor(
    @Inject(FirebaseApp) private firebaseApp: any,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private global: GlobalRef) {
    this.getUser();

    this.currentUser=new BehaviorSubject<any>(firebase.auth().currentUser);
    firebase.auth().onAuthStateChanged(user1=>{
      
               // if(user)
                  console.log(user1);
                  this.user=user1.uid;
                  console.log(this.user)
                  this.currentUser.next(user1);
                  
                });
  }

  isReady(){
    return this.currentUser;
  }

  setReceivedData(receivedData) {
    this.receivedData = receivedData;
  }
  getReceivedData() {
    return this.receivedData;
  }

  getUser() {
    
  //  this.auth.subscribe(user => user ? this.user = user.uid : '');
  }

  /* Get data from Firebase Storage */
  getGuns(type: string) {
    const terrainsArr = [];
    this.terrainsArr.forEach(item => {
      terrainsArr.push(firebase
        .storage(this.firebaseApp)
        .ref('gunImages')
        .child(type)
        .child(`gun${item}.png`)
        .getDownloadURL()
        .then(data => data)
      );
    });
    return Promise.all(terrainsArr)
      .then(data => data);
  }

  getGunsFromLibrary(type: string) {
    console.log(`Getting guns from libraray ->/usernames/${this.user}/gunLibrary` )
    if (this.user) {
      const terrainLibraryList = this.db.list(`/usernames/${this.user}/gunLibrary`);
      console.log(terrainLibraryList);
      return terrainLibraryList;
    } else {
      console.log('SHIT HAPPENED');
      return Observable.of([]);
    }
  }

  /* Add data to Firebase db */
  addTerrain(terrain) {
    const wnd = this.global.nativeGlobal;
    const toastr = wnd.toastr;
    if (firebase.auth().currentUser) {
      const terrainType = terrain.type;
      const terrainName = terrain.name;
      firebase.database()
        .ref('usernames')
        .child(this.user)
        .child('gunLibrary')
        .once('value', (snapshot) => {
          if (snapshot.val()) {
            firebase.database()
              .ref('usernames')
              .child(this.user)
              .child('gunLibrary')
              .once('value', data => {
                const value = data.val();
                if (value) {
                  const exist = Object.keys(value).filter(key => {
                    return value[key].name === terrainName && value[key].type === terrainType;
                  });
                  console.log(exist);
                  if (!exist.length) {
                    this.pushNewTerrain(terrainType, terrainName, terrain.src);
                  } else {
                    toastr.error('Already in your library');
                  }
                } else {
                  toastr.error('Already in your library');
                }
              });
          } else {
            this.pushNewTerrain(terrainType, terrainName, terrain.src);
          }
        });
    }
  }
  addGunToGame(gun) {
    console.log("adding gun to game")
console.log(gun)
    const wnd = this.global.nativeGlobal;
    const toastr = wnd.toastr;
    if ( firebase.auth().currentUser ) {
      const gunType = gun.type;
      const gunName = `${gun.type} ${gun.name}`;
      firebase.database()
        .ref('usernames')
        .child(this.user)
        .child('gameLibrary')
        .child('gunModels')
        .once('value', (snapshot) => {
          if ( snapshot.val() ) {
            firebase.database()
              .ref('usernames')
              .child(this.user)
              .child('gameLibrary')
              .child('gunModels')
              .once('value', data => {
                const value = data.val();
                if ( value ) {
                  const exist = Object.keys(value).filter(key => {
                    return value[key].name === gunName && value[key].type === gunType;
                  });
                  console.log(exist);
                  if ( !exist.length ) {
                    this.pushToGame(gunType, gunName, gun.src);
                  } else {
                    toastr.error('Already in your library');
                  }
                } else {
                  toastr.error('Already in your library');
                }
              });
          } else {
            this.pushToGame(gunType, gunName, gun.src);
          }
        });
    }
  }

  removeTerrainsFromLibray(key){
    let terrainLibraryList = this.db.list(`/usernames/${this.user}/gunLibrary`);
    terrainLibraryList.remove(key);
  }

  removeGunFromLibrary(key){
    //let terrainLibraryList = this.db.list(`/usernames/${this.user}/gunLibrary`);
    //terrainLibraryList.remove(key);
    console.log("removing key "+key);  
  this.db.object(`/usernames/${this.user}/gunLibrary/${key}`).set(null);
  }

  pushNewTerrain(terrainType: string, terrainName: string, src?: string) {
    const wnd = this.global.nativeGlobal;
    const toastr = wnd.toastr;
    const newObjRef = firebase.database()
      .ref('usernames')
      .child(this.user)
      .child('gunLibrary')
      .push();
    newObjRef.set({
      type: terrainType,
      name: terrainName,
      src: src
    }, (result) => console.log(result)).then(result => {
      console.log(result);
    });
    toastr.info('Added to your library');
  }
  pushToGame(gunType: string, gunName: string, src?: string) {
    
    const wnd = this.global.nativeGlobal;
    const toastr = wnd.toastr;
    const newObjRef = firebase.database()
      .ref('usernames')
      .child(this.user)
      .child('gameLibrary')
      .child('gunModels')
      .push();


      const filename = `${newObjRef.key}.png`;
      
             var request = new XMLHttpRequest();
                      request.open('GET', src, true);
                      request.responseType = 'blob';
      
                      request.send(null);
                      toastr.info("preparing files to upload");
                      request.onerror=(e:ErrorEvent)=>{
                              toastr.erro("Failed to process file");
                      };
                      request.onreadystatechange =  ()=> {
                      if (request.readyState === 4 && request.status === 200) {
      
                            //console.log(request.response);
                                   firebase.storage().ref('/gameLibrary/gunModels').child(`${filename}`).put(request.response).then((snapshot)=>{
      
                                        console.log("adding gunGen to library");
                                        console.log(newObjRef);
                                        newObjRef.set({
                                        type: gunType,
                                        name: `${gunType} ${gunName}`,
                                        src: src,
                                        imageLink:snapshot.downloadURL
                                        }).then((d)=>{
                                            if(d){
                                                    console.log("failed to add Gun gen to libraray");
                                                      console.log(d);
                                                      toastr.info("failed to Gun model to your library");
                                                    }
                                                });
                                          toastr.info('Added to your game library');
      
      
      
      
                                   });
      
                          }};
      
      
             }


       getGunJson(gun1,gun2){
console.log(gun1);
console.log(gun2);
console.log("GUN JSONS DOWNLOADING");

        let gunType1=gun1.type;
        let gunType2=gun2.type;
        let gun1Name:string=gun1.name
        gun1Name=gun1Name.replace("png","json");

        let gun2Name:string=gun2.name
        gun2Name=gun2Name.replace("png","json");
        console.log(gun2Name+"    gun1 "+gun1Name);
        
        var file1= new Promise((resolve,reject)=>{ firebase.storage().ref(`/gunJSON/${gunType1}`).child(gun1Name).getDownloadURL().then(url=>{
          
          
                    // This can be downloaded directly:
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'text';
                    xhr.onload = function(event) {
                      var blob = xhr.response;
                      resolve(JSON.parse(blob));
                    };
                    xhr.open('GET', url);
                      xhr.send();
                  }).catch((err)=>{

                    console.log("Failed to load json");
                    reject(err);
                  });
          
          
                  });
          
                  var file2= new Promise((resolve,reject)=>{ firebase.storage().ref(`/gunJSON/${gunType2}`).child(gun2Name).getDownloadURL().then(url=>{
                    
                    
                              // This can be downloaded directly:
                              var xhr = new XMLHttpRequest();
                              xhr.responseType = 'text';
                              xhr.onload = function(event) {
                                var blob = xhr.response;
                                resolve(JSON.parse(blob));
                              };
                              xhr.open('GET', url);
                                xhr.send();
                            }).catch((err)=>{
          
                              console.log("Failed to load json");
                              reject(err);
                            });
                    
                    
                            });
                            
                            

            return Promise.all([file1,file2]);
          


       }      
}
