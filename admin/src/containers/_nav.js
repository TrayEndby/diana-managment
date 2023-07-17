const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "USER SIGN UP",
    to: "/user-sign-up",
  },
  {
    _tag: "CSidebarNavItem",
    name: "EVENT REGISTRATION",
    to: "/event-registration",
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "MAILING LIST",
    to: "/mailing-list",
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Ua",
        to: "/mailing-list/1",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Ea",
        to: "/mailing-list/2",
      }
    ],
  },
];

export default _nav;
