import { Injectable, OnDestroy  } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs'
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class KeychainService implements OnDestroy {

  public onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  connectionStatus = new BehaviorSubject(null);
  connectionStatusObservable = this.connectionStatus.asObservable();

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

 public tokenInfo: any;
 public user: any;
 public userId:any;
 public dkData:any = [];
 public tenantId: string;
 public customerId: string;
 public isNewUser: any;
 public privilegesGroupByFeature: any = {};
 public customerTemplates: any = [];

  constructor() {
    let tokenInfo = this.getTokenInfo(this.getStorageType().getItem(this.getStorageTokenInfoKey()))
    let user = JSON.parse(this.getStorageType().getItem(this.getStorageUserKey()) || '{}');
    let userId = this.getStorageType().getItem(this.getStorageUserIdKey())
    let dkData = JSON.parse(this.getStorageType().getItem(this.getDkDataStorageKey()) || '[]');
    let newUser = this.getStorageType().getItem(this.getNewUserStorageKey());
    let customerTemplates = JSON.parse(this.getStorageType().getItem(this.getCustomerTemplateStorageKey()) || '[]');


    if (tokenInfo) {
      this.tokenInfo = tokenInfo;
      this.user = user;
      this.dkData = dkData;
      this.isNewUser = (newUser === 'true');
      this.privilegesGroupByFeature = this.getPrivilegesGroupByFeature();
      this.customerTemplates = customerTemplates;
    }
    this.start();
    
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  showLoader(){
    this.isLoadingSubject.next(true);
  }

  hideLoader(){
    this.isLoadingSubject.next(false);
  }

  isLoggedIn() {
    return !!this.tokenInfo;
  }

  saveTokenInfo(tokenInfo: any){
  	if(tokenInfo){
	    this.getStorageType().setItem(this.getStorageTokenInfoKey(), JSON.stringify(tokenInfo));
	    this.tokenInfo = tokenInfo;
  	}
  }

  saveCustomerTemplates(customerTemplates: any){
    if(customerTemplates){
      this.getStorageType().setItem(this.getCustomerTemplateStorageKey(), JSON.stringify(customerTemplates));
      this.customerTemplates = customerTemplates;
    }
  }

  getTokenInfo(tokenInfo){
    if(tokenInfo){
        try{
            return JSON.parse(tokenInfo);
        } catch(e){}
    }
    return false;
  }
  
   save(user: any) {
    this.getStorageType().setItem(this.getStorageUserKey(), JSON.stringify(user));
    this.user = user;
    this.getStorageType().setItem("userId", user.userId);
    this.privilegesGroupByFeature = this.getPrivilegesGroupByFeature();
  }

  clear() {
    /*
    this.getStorageType().removeItem(this.getStorageTokenInfoKey());
    this.getStorageType().removeItem(this.getStorageUserKey());
    this.getStorageType().removeItem(this.getDkDataStorageKey());
    this.getStorageType().removeItem(this.getUserPushNotificationRegisteredKey());
    this.getStorageType().removeItem('lastSyncTime');
    this.getStorageType().removeItem('dkActiveIndex');
    this.getStorageType().removeItem(this.getCustomerTemplateStorageKey());
    */
    // this.getStorageType().clear();
    
    this.tokenInfo = undefined;
    this.dkData = [];
  }

  
  setLastSyncTime(lastSyncTime) {
    this.getStorageType().setItem('lastSyncTime', lastSyncTime);
  }

  getLastSyncTime() {
    return this.getStorageType().getItem('lastSyncTime') ? this.getStorageType().getItem('lastSyncTime') : 0;
  }
  
  getStorageType(){
    if(environment.storage.type == 'session'){
      return sessionStorage;
    } else { // defaulted to local
      return localStorage;
    } 
  }

  getStorageTokenInfoKey(){
    return environment.storage.tokenInfoKey;
  }
  
  getStorageUserIdKey(){
    return environment.storage.userIdKey;
  }

  getStorageUserKey(){
    return environment.storage.userKey;
  }
  
  getDkDataStorageKey(){
   return environment.storage.dkDataKey;
  }
  
  getCustomerTemplateStorageKey(){
   return environment.storage.customerTemplateKey;
  }
  
  
  getNewUserStorageKey(){
    return environment.storage.isNewUser;
  }

  getUserPushNotificationRegisteredKey(){
  	return environment.storage.userPushNotificationRegistered;
  }
  
  isUserPushNotificationRegistered(){
  	return !!this.getStorageType().getItem(this.getUserPushNotificationRegisteredKey());
  }
  
  setUserPushNotificationRegistered(){
  	this.getStorageType().setItem(this.getUserPushNotificationRegisteredKey(), "1");
  }
  
  getAccessToken(){
  	return this.isLoggedIn() && this.tokenInfo.access_token;
  }
  
  getRefreshToken(){
  	return this.isLoggedIn() && this.tokenInfo.refresh_token;
  }
  
  generateMacIdForPushNotification(){
  	let webMacId = this.getStorageType().getItem("webMacId") || 'Web-' + new Date().getTime();
  	this.getStorageType().setItem("webMacId", webMacId);
  	return webMacId;
  }
  
  updateDKData(dks, replaceFlag?){
    if(replaceFlag) {
    	this.dkData = dks;
    } else {
    	let newDksMap = {};
    	dks.forEach(dk => {
    		newDksMap[dk.guid] = dk;
    	});
    	// update dks...
    	this.dkData = this.dkData.map(dk => {
    		if(newDksMap[dk.guid]){
    			dk = newDksMap[dk.guid];
    			delete newDksMap[dk.guid];
    		}
    		return dk;
    	})
    	// new dks...
		  Object.keys(newDksMap).forEach(ndkGuid => {
			 this.dkData.push(newDksMap[ndkGuid]);
		  });
		  // deleted dks...
		  this.dkData = this.dkData.filter(dk => dk.dkStatus != 3)
    }
    
    // sort by updatedDate in descending order...
  	this.dkData = this.dkData.sort((a, b) => {
    	return a.sortedDate > b.sortedDate ? 1 : a.sortedDate < b.sortedDate ? -1 : 0;
	  }).reverse();
  	
  	this.getStorageType().setItem(this.getDkDataStorageKey(), JSON.stringify(this.dkData));
  	
  	return this.dkData;
  }

  setDkGuidList(dkGuidList){
  	this.getStorageType().setItem('dkGuidList', dkGuidList);
  }
  getDkGuidList(){
  	this.getStorageType().getItem('dkGuidList');
  }
  
  setDigitalKit(dk){
    let dkList = JSON.parse(this.getStorageType().dkList)
    dkList.push(dk);
    this.getStorageType().setItem('dkList', dkList);
  }
  
  getDigitalKitList(){
  	return JSON.parse(this.getStorageType().getItem('dkList'));
  }
  
  setDigitalKitList(dkList){
    this.getStorageType().setItem('dkList', JSON.stringify(dkList));
    this.onSubject.next({ key:"dkList", value: dkList})
  }
  
  getTenantId(){
    if(this.user) return this.user.tenantId;
    return "";
  }
  
  getCustomerId(){
    if(this.user) return this.user.tenantId;
    return "";
  }

  getUserId(){
    if(this.user) return this.user.userId;
    return "";
  }
  
  getUserRole(){
    if(this.user) return this.user.role;
    return "";
  }

  getUserMobileNumber(){
    if(this.user && this.user.contact) return this.user.contact.mobile;
    return "";
  }
  getUserEmalId(){
    if(this.user && this.user.contact) return this.user.contact.email;
    return "";
  }
  
  getUserIsdCode(){
    if(this.user && this.user.contact) return this.user.contact.isdCode;
    return "";
  }
  getUserName(){
    if(this.user) return this.user.firstName;
    return "";
  }

  setActiveDkIndex(index){
    this.getStorageType().setItem('dkActiveIndex', index);
  }
  getActiveDkIndex(){
	if(this.getStorageType().getItem('dkActiveIndex')){
		return parseInt(this.getStorageType().getItem('dkActiveIndex'));
	}
   return 0;
  }
  
  getCountryCode(){
    if(this.user) return this.user.countryCode;
    return "";
  }

  getPrivilegesGroupByFeature(){
    let privilegesGroupByFeature = {};
    if(this.user && this.user.privileges) {
      this.user.privileges.map((privilege, i) => {
        let privilegeSplit = privilege.split("_");
        let action = privilegeSplit[0];
        let feature = privilegeSplit[1];

        if(!privilegesGroupByFeature[feature]) privilegesGroupByFeature[feature] = [];
        privilegesGroupByFeature[feature].push(action);
      })
    }
    return privilegesGroupByFeature;
  }

  validateIfUserPrivilegedForFeature(e){
    if(!e || !e.privilege) return true;
    if(!e.privilegeName) return false;
    

    let actionPrivilegeName, featurePrivilegeName;
    let privilegeSplit = e.privilegeName.split("_");
    if(privilegeSplit.length > 1){
      actionPrivilegeName = privilegeSplit[0];
      featurePrivilegeName = privilegeSplit[1];
    } else {
      featurePrivilegeName = privilegeSplit[0];
    }
    // IN FUTURE, enable fieldPrivilegeName, if required...

    let featurePrivileges = this.privilegesGroupByFeature[featurePrivilegeName];
    if(!featurePrivileges || featurePrivileges.length == 0) return false;
    if(actionPrivilegeName && featurePrivileges.indexOf(actionPrivilegeName) == -1) return false;
    return true;
  }

  getLabelOverride(label){
    if(!label) return "";
    if(this.customerTemplates[label.key]) return this.customerTemplates[label.key];
    return label.value;
  }


  

  public getStorage() {
    let s = [];
    for (let i = 0; i < this.getStorageType().length; i++) {
      s.push({
        key: this.getStorageType().key(i),
        value: JSON.parse(this.getStorageType().getItem(this.getStorageType().key(i)))
      });
    }
    return s;
  }

  public store(key: string, data: any): void {
    this.getStorageType().setItem(key, JSON.stringify(data));
    // the local application doesn't seem to catch changes to localStorage...
    this.onSubject.next({ key: key, value: data})
  }

  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == this.getStorageType()) {
      let v;
      try { v = JSON.parse(event.newValue); }
      catch (e) { v = event.newValue; }
      this.onSubject.next({ key: event.key, value: v });
    }
  }

  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.onSubject.complete();
  }

  ngOnDestroy() {  
    this.stop();
  }
  
}