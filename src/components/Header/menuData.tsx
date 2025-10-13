import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "ABOUT US",
    path: "/about",
    newTab: false,
  },
  {
    id: 3,
    title: "CALENDAR",
    path: "/calendar",
    newTab: false,
  },
  {
    id: 4,
    title: "WORKSHOPS",
    path: "/workshops-list",
    newTab: false,
  },
  // {
  //   id: 5,
  //   title: "SYMPOSIUM",
  //   path: "/symposium",
  //   newTab: false,
  // },
  {
    id: 5,
    title: "SYMPOSIUM",
    path: "/symposium-new",
    newTab: false,
  },
  {
    id: 6,
    title: "PEOPLE",
    path: "/team",
    newTab: false,
  },
  {
    id: 7,
    title: "NEWS",
    path: "/newsletter",
    newTab: false,
  },
];
export default menuData;
