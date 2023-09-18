export interface UserInfo {
  year: number;
  userGuid: string;
  orgGuid: string;
  orgCode: string;
  orgName: string;
  orgType: number;
  userType: string;
  financeDeptGuid: string;
  financeDeptName: string;
  regionGuid: string;
  regionCode: string;
  regionName: string;
  loginName: string;
  userName: string;
  postName: string;
  caKey: string;
  telphone: string;
  mobile: string;
  admin: number;
  accessToken: string;
  subarea: string;
  isScience: number;
  departGuid: string;
  departName: string;
  posts: string;
  orgLinkMan: string;
  orgLinkPhone: string;
  orgAddress: string;
  avatar?: string;
}
export interface MenuOrg {
  buttons: [],
  component: string,
  funId: string,
  funPId: string,
  functionName: string,
  functionParam: string,
  functionUrl:string,
  icon?: string,
  label: string,
  name: string,
  orderId: 2,
  path: string,
  query: string,
  remark: string,
  subarea: string,
  url: string,
  javaEvent: string
}
export type Menu = Omit<MenuOrg, 'javaEvent'> & {
  children?: MenuOrg[]
} 


