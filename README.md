# Firebase Trigger Github Action

This action allows you to set values into your firebase database (`realtime` or `firestore`) from and based on your current build.

I call it trigger because of what this allows you to do. Firebase has extensive tools allowing you to setup functionally that happens when you do things in your database. Weather it is a Cloud Function, Pub Sub, or just a notification on a website used by your users.

## Inputs

* `credentials` - **Required** This action uses firebase admin, so you need to provide a service account json object for proper authentication.
* `databaseUrl` - **Required** Database Url you are trying to connect to. It is usually something like: `https://[project_id].firebaseio.com`
* `databaseType` - **Optional** The database you want to connect to. Defaults to `realtime`, Accepts `realtime` and `firestore`.
* `path` - **Required** Path to the field you want to modify. If you are using firestore, this is the collection path.
* `doc` - **Required for Firestore** Document you want to modify. Uses set, so it will write/overwrite the whole file.
* `value` - **Optional** Value you would like to set. Defaults to `Date.now()` timestamp. If you are using Firestore this MUST be a JSON Object.

## Usage

Writes to a realtime database, and sets the lastRelease to a `Date.now()` timestamp.

```yaml
notify:
  runs-on: ubuntu-latest
  name: Nofity
  needs: [build, deploy]
  steps:
    - name: Update latest version in realtime database
      uses: w9jds/firebase-trigger@master
      with:
        credentials: ${{ secrets.FIREBASE_CREDENTIALS }}
        databaseUrl: https://[project_id].firebaseio.com
        path: version/lastRelease
```

### Recommendation

You should store the Service Account JSON into a secret on your repo. Also, this can be very powerful if you start passing outputs from other jobs into this one to write values.
