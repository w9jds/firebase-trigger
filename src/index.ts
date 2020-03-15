import * as core from '@actions/core';
import * as admin from 'firebase-admin';

const isRequired = {
  required: true,
};

let firebase: admin.app.App;

const initFirebase = () => {
  try {
    const config = core.getInput('firebaseConfig', isRequired);
    const secrets = JSON.parse(config);

    firebase = admin.initializeApp(secrets);
  } catch {
    core.setFailed('Failed to initialize connection to firebase application');
    process.exit(core.ExitCode.Failure);
  }
}

const getDatabaseType = () => {
  let type = core.getInput('databaseType');

  type = !type ? 'realtime' : type;

  if (type !== 'realtime' && type !== 'firestore') {
    core.setFailed('Database type invalid, please set to either realtime or firestore');
    process.exit(core.ExitCode.Failure);
  }

  return type;
}


const processAction = async () => {
  initFirebase();

  const databaseType = getDatabaseType();
  const path: string = core.getInput('path', isRequired);
  const value = core.getInput('value', isRequired);

  if (databaseType === 'realtime') {
    updateRealtimeDatabase(path, value);
  }

  if (databaseType === 'firestore') {

  }

}

processAction().catch(error => {
  core.setFailed(error);
  process.exit(core.ExitCode.Failure);
});



