export const otherConfigs = {
	USERDATA_KEY: 'authf649fc9a5f55',
	isMockEnabled: true,
	apiUrl: '',

	appName: 'Intensify Now',
  	applicationType:"1",
  	appUrl: 'https://goo.gl/k98nGF',
  	appVersion:'5.0.10',
  	escapeUrls:[ "productLookup/validateUniqueCode", "productRegistration" ],
    getProxyServerUrl: '', //'https://www.Intensify.com/utils/proxy/get_proxy.php?url=',
    googleApiKey: 'AIzaSyBEff6qUFOdqyCe0uEBIVrLVbNYykFOxx0',
    googleMapApiUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
    googleMapApiTextUrl: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    firebase: {
	    apiKey: "AIzaSyD98sgCSfaT930oy-59TbERl0jz81SF8l4",
	    authDomain: "Intensify-3daf7.firebaseapp.com",
	    databaseURL: "https://Intensify-3daf7.firebaseio.com",
	    projectId: "Intensify-3daf7",
	    storageBucket: "Intensify-3daf7.appspot.com",
	    messagingSenderId: "522291441489"
   },
  	storage: {
	  	type: 'local', // 'session', 'local'
	  	userKey: 'user',
	  	tokenInfoKey: 'tokenInfo',
	  	dkDataKey: 'dkData',
	  	isNewUser: 'isNewUser',
	  	countyCode: 'countyCode',
	  	userIdKey: 'userId',
		userPushNotificationRegistered: 'userPushNotificationRegistered',
		customerTemplateKey: 'customerTemplate'
	},
  	getApiUrl: (skipVersion?) => {
	  	return getURL(skipVersion);
	},
	isProductionServer: isProductionServer,
  	isAmazonS3EnabledInServer: () => {
	  	if(["localhost", "127.0.0.1", "139.59.12.52", "dev.Intensify.com", "staging.Intensify.com"].indexOf(window.location.hostname) > -1){
	  		return false;
	  	}
	  	return true;
	},
	getCountryDomainUrl: () => {
		let countries = {
			"IN": {code: "91", flag: "india", url: "https://app-in.Intensify.com/"},
			"UAE": {code: "971", flag: "uae", url: "https://app-me.nhancIntensifyenow.com/"},
			"US": {code: "1", flag: "usa", url: "https://staging.Intensify.com/"},
		};
		let retVal = [];
		Object.keys(countries).forEach((c) => {
			retVal.push({
				active: getURL() == countries[c].url,
				src: "assets/img/country/"+countries[c].flag+".png",
				label: c,
				code: countries[c].code,
				redirect: isProductionServer() ? countries[c].url + 'pwa/' : false
			});
		});
		if(retVal.filter(c => c.active).length == 0){
			retVal[0].active = true;
		}
		return retVal;
	},
	secureLayoutPrefix: "", // CAN GIVE PREFIX LIKE GMAIL URL "mail/u/0/?#inbox"

	allStatusMaps: {
		serviceRequestStatusMap: () => {
			return {
				1: 'New',
				2: 'Under Progress',
				4: 'resolved',
				5: 'Reopen'
			}
		},
		campaignTypeMap: () => {
			return {
				1: 'Smart Notification',
				7: 'Offers',
				6: 'Feedback'
			}
		},
		configureUnicodeGeneratedMethod: () => {
			return {
				manual: 'Manual',
				sequential: 'Sequential',
				import: 'Import'
			}
		},
		rolesApplicationTypeEnum: () => {
			return {
				1: 'WEB',
				2: 'CONSUMER',
				3: 'SERVICE_ENGINEER',
				4: 'OUTLET_MANAGER'
			}
		},
		categoriesTypelist: () => {
			return {
				1: 'Category',
				2: 'SubCategory',
				3: 'Manufacturer'
			}
		},
		fileUploadTypeEnum: () => {
			return {
				1: 'Upload File',
				2: 'URL'
				// 3: 'Generate Invoice'
			}
		},
		dkCustomFieldDataTypeEnum: () => {
			return {
				string: 'Alphanumeric',
				date: 'Date',
				email: 'Email'
			}
		}
	}
}
export function isProductionServer() {
	if(["localhost", "127.0.0.1", "139.59.46.199", "139.59.12.52", "dev.Intensify.com", "qa.Intensify.com"].indexOf(window.location.hostname) > -1){
		return false;
	}
	return true;
}
export function getURL(skipVersion?){
	// TODO: Remove port logic once the port in localhost is removed...
  	let port = "";
  	if(["localhost", "127.0.0.1"].indexOf(window.location.hostname) > -1){
    	port = ":4100";
  	}
  	let apiPrefix = (skipVersion) ? ""  : "";
  	
	// return window.location.protocol + "//" + window.location.hostname + port + "/" + apiPrefix;
	
	  	
  	// DEV API URL
	return "https://dev.Intensify.com/" + apiPrefix;
	// return "https://app-in.Intensify.com/" + apiPrefix;
}
