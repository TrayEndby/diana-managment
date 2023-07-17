//  ListUserType base on /profile/list {mode: 6} API
// e.g:
// curl --header "Content-Type: application/json"  --request POST -H "SECRET: m75jnbExnb0xzD7SffpMzZid5"  -H "AUTH-UID: test_id_johndoe" --data '{"mode":6}' https://vm.kyros.ai:23456/api/profile/list

export const PROFILE_TYPE = {
  Counselor: "Counselor",
  DataAdmin: "System Data Admin",
  Educator: "Educator",
  Guest: "Guest",
  RegularHSStudent: "Student",
  SystemInternal: "System Internal",
  Parent: "Parent",
  CSA: "CSA",
  Perspective: "Perspective",
  ContentCreator: "Content Creator",
  AccountAdmin: "Account Admin",
  EventEmailAdmin: "Event and Email Admin",
}

export const PROFILE_TYPE_ID = {
  [PROFILE_TYPE.Parent]: 1,
  [PROFILE_TYPE.CSA]: 2,
  [PROFILE_TYPE.RegularHSStudent]: 3,
  [PROFILE_TYPE.Perspective]: 4,
  [PROFILE_TYPE.Guest]: 6,
  [PROFILE_TYPE.SystemInternal]: 7,
  [PROFILE_TYPE.Counselor]: 8,
  [PROFILE_TYPE.DataAdmin]: 9,
  [PROFILE_TYPE.Educator]: 10,
  [PROFILE_TYPE.ContentCreator]: 11,
  [PROFILE_TYPE.AccountAdmin]: 12,
  [PROFILE_TYPE.EventEmailAdmin]: 13,
}
