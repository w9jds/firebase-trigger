import * as core from '@actions/core';
import * as admin from 'firebase-admin';

let firebase: admin.app.App;
const isRequired = {
  required: true,
};

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

const getValue = () => {
  const value = core.getInput('value');

  if (!value) {
    return Date.now();
  }

  try {
    return JSON.parse(value);
  } catch {
    const num = Number(value);

    if (isNaN(num)) {
      return value;
    }

    return num;
  }
}

const processAction = async () => {
  initFirebase();

  const databaseType = getDatabaseType();
  const path: string = core.getInput('path', isRequired);
  const value = getValue();

  if (databaseType === 'realtime') {
    await firebase.database()
      .ref(path)
      .set(value,
        error => {
          if (error instanceof Error) {
            core.setFailed(error.message);
          }

          process.exit(core.ExitCode.Failure);
        }
      );
  }

  if (databaseType === 'firestore') {
    const document = core.getInput('doc', isRequired);
    const contents = JSON.parse(value);

    await firebase.firestore()
      .collection(path)
      .doc(document)
      .set(contents);
  }

  process.exit(core.ExitCode.Success);
}

processAction().catch(error => {
  core.setFailed(error);
  process.exit(core.ExitCode.Failure);
});
