import * as firebaseAdmin from "firebase-admin";
// const serviceAccount = require("/Users/vi40070509/Work/Secrets/TAWebPortal/adminkey.json");
import * as taServiceAccount from "../Secrets/TAWebPortal/adminkey.json";
import * as swServiceAccount from "../Secrets/Softwiz/adminkey.json";
import * as vinServiceAccount from "../Secrets/VinodTiru/adminkey.json";

export class firestoreProject {
  private docPath = '' ;
  constructor(project: String) {
    if (project == "ta") {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(taServiceAccount as any),
        databaseURL: "https://tekarchwebportal.firebaseio.com",
        storageBucket: "tekarchwebportal.appspot.com",
      });
      this.docPath = '/Users/vi40070509/Work/Docs/TADocs/docs';
    } else if (project == "sw") {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(swServiceAccount as any),
        databaseURL: "https://tasamplewebsite.firebaseio.com",
        storageBucket: "tasamplewebsite.appspot.com",
      });
      this.docPath = '/Users/vi40070509/Work/Docs/SWDocs/docs';
    } else if (project == "vinod") {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(vinServiceAccount as any),
        databaseURL: "https://vinod-tiru.firebaseio.com",
        storageBucket: "vinod-tiru.appspot.com",
      });
      this.docPath = '/Users/vi40070509/Work/Docs/VinodDocs/docs';
    }
  }

  
  getDB() {
    return firebaseAdmin.firestore();
  }

  getStorageBucket() {
    return firebaseAdmin.storage().bucket();
  }

  getDocPath(){
    return this.docPath;
  }
}
