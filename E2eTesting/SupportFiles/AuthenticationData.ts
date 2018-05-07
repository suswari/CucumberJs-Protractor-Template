import { browser } from 'protractor';
let BASEURL = browser.baseUrl;
const local_env={
    Admin:{Uname:'Admin',Pcode:'pcode'},

};
const stage={
    Admin:{Uname:'saadmin',Pcode:'Passw0rd!'},
    SiteAdmin:{Uname:'siteadmin',Pcode:'Passw0rd'}

};
let default_env;
if (BASEURL.includes("local")){
    default_env = local_env;
}
else if(BASEURL.includes("stage")) {
    default_env = stage;
}
export {default_env};
