import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIRBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export default class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.startAnalytics();
    this.auth = firebase.auth();
  }

  startAnalytics() {
    try {
      if (process.env.NODE_ENV === 'production') {
        this.analytics = firebase.analytics();
        this.analytics.logEvent('analytics_start');
      } else {
        console.info("Non-production version, firebase analytics is turned off");
      }
    } catch (e) {
      console.error(e);
    }
  }

  logEvent(name, value) {
    if (this.analytics) {
      this.analytics.logEvent(name, value);
    }
  }

  setCurrentScreen(name) {
    if (this.analytics) {
      this.analytics.setCurrentScreen(name);
    }
  }

  doSignOut = () => this.auth.signOut();
}
