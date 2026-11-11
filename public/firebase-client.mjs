// Pinned official browser SDK. Loaded only when account sign-in is configured.
import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithPopup,linkWithPopup,signOut,GoogleAuthProvider,OAuthProvider,browserLocalPersistence,setPersistence} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';
export async function connect(config){
 const app=getApps().find(a=>a.name==='flow-club')||initializeApp(config,'flow-club');const auth=getAuth(app);
 await setPersistence(auth,browserLocalPersistence);
 function provider(id){const p=id==='google.com'?new GoogleAuthProvider():new OAuthProvider(id);if(id==='apple.com'){p.addScope('email');p.addScope('name');}if(id==='microsoft.com')p.setCustomParameters({tenant:'common'});return p;}
 return {auth,watch:fn=>onAuthStateChanged(auth,fn),login:id=>signInWithPopup(auth,provider(id)),link:id=>linkWithPopup(auth.currentUser,provider(id)),logout:()=>signOut(auth)};
}
