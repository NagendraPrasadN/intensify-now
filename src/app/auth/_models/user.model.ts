import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  email: string;
  password: string;
  tenantId: string;
  userId: string;
  userName: string;
  guid: string;
  customerId: string;
  index: number;
  operationType: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  lastSyncTime: number;
  contact: {
    email: string;
    mobile: string;
    isdCode: number;
  };
  applicationType: string;
  defaultLocale: string;
  applicationVersion: string;
  tenantName: string;
  tasks: string; // TODO: CROSS CHECK LATER
  appName: string;
  privileges: string[];
  firstTimeLogin: boolean;
  passwordExpired: boolean;
  role: string;
  superUser: boolean;
  countryCode: string;
  confCompleted: boolean;
  referralCode: string;
  promotionalMessage: string;
  firstName: string;
  pic: string;
  currency: string;
  intensifyAdminUser: boolean;
  planFeatures: any;
  edit: boolean;
  customerTemplates: any;
  /*
  // TODO: Work on Profile picture later...
  userProfileImage: {": 5aa1fba4-f5f8-413a-a0d3-cea4d3db8188","userId: null,"userName: null,"guid: f37dac9e-ac30-4a7d-b604-351ac8b1c70d","customerId: null,"index: null,"operationType: null,"createdBy: null,"updatedBy: null,"createdDate: 2019-11-05T14:04:23.922+0000","updatedDate: 2019-11-05T14:04:23.922+0000","lastSyncTime: null,"contact: null,"applicationType: null,"defaultLocale: null,"applicationVersion: null,"tenantName: null,"tasks: null,"appName: null,"documentId: 999141,"documentExtention: jpg","documentName: ProfilePic","documentPath: https://app-in.intensifynow.com/b2c/v3/document/downloadDocument/f37dac9e-ac30-4a7d-b604-351ac8b1c70d","documentData: null,"fileUploadType: 1,"documentUploadedByType: 1,"documentStatus: 1,"referenceType: 3,"referenceId: 082e035a-15cf-4b59-b275-7f0e8f53ac05","referenceIdList: null,"documentTypes: [7],"ownerId: null,"allowToShare: null,"presignedUrlExpiryInSeconds: null,"menuName: null,"mimeType: null,"cloneDocument: false,"documentCaption: null,"edit: false},
  */

  fullname: string;
  firstname: string;
  lastname: string;

  setUser(user: any) {
    this.email = '';
    this.password = '';
    this.tenantId = user.tenantId;
    this.userId = user.userId;
    this.userName = user.userName;
    this.guid = user.guid;
    this.customerId = user.customerId;
    this.index = user.index;
    this.operationType = user.operationType;
    this.createdBy = user.createdBy;
    this.updatedBy = user.updatedBy;
    this.createdDate = user.createdDate;
    this.updatedDate = user.updatedDate;
    this.lastSyncTime = user.lastSyncTime;
    this.contact = user.contact;
    this.applicationType = user.applicationType;
    this.defaultLocale = user.defaultLocale;
    this.applicationVersion = user.applicationVersion;
    this.tenantName = user.tenantName;
    this.tasks = user.tasks || [];
    this.appName = user.appName;
    this.privileges = user.privileges || [];
    this.firstTimeLogin = user.firstTimeLogin;
    this.passwordExpired = user.passwordExpired;
    this.role = user.role;
    this.superUser = user.superUser;
    this.countryCode = user.countryCode;
    this.confCompleted = user.confCompleted;
    this.referralCode = user.referralCode;
    this.promotionalMessage = user.promotionalMessage;
    this.firstName = user.firstName;
    // this.userProfileImage = user.userProfileImage;
    this.currency = user.currency;
    this.intensifyAdminUser = user.intensifyAdminUser;
    this.planFeatures = user.planFeatures;
    this.edit = user.edit;
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.customerTemplates = user.customerTemplates || [];

    this.fullname = this.firstName;
    this.firstname = this.firstName;
    this.lastname = '';
  }

  setCustomerTemplates(customerTemplates){
    this.customerTemplates = customerTemplates || [];
  }
}
