// ui mock data
export const subscriptionsSample = [
  {
    amount: 5000,
    searches: 5,
    payingNumber: "",
    name: "bronze",
  },
  {
    amount: 12000,
    searches: 14,
    payingNumber: "",
    name: "silver",
  },
  {
    amount: 30000,
    searches: 34,
    payingNumber: "",
    name: "gold",
  },
  {
    amount: 60000,
    searches: 65,
    payingNumber: "",
    name: "platinum",
  },
];
export const subscriptionsDummy = [
  {
    amount: 0,
    searches: 0,
    payingNumber: "",
    name: "...",
  },
  {
    amount: 0,
    searches: 0,
    payingNumber: "",
    name: "...",
  },
  {
    amount: 0,
    searches: 0,
    payingNumber: "",
    name: "...",
  },
  {
    amount: 0,
    searches: 0,
    payingNumber: "",
    name: "...",
  },
];

import * as Icons from "react-icons/hi";
import * as Icons2 from "react-icons/hi2";

export const SideBarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        name: "Home",
        icon: (
          <Icons.HiHome className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        route: "/",
      },
      {
        name: "Manage Bailiffs",
        icon: (
          <Icons2.HiUsers className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        route: "/manage-bailiffs",
      },
      {
        name: "Import Data",
        icon: (
          <Icons2.HiFolderArrowDown className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        route: "/import-data",
      },
      {
        name: "Approvals",
        icon: (
          <Icons2.HiClock className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        route: "/pending-approvals",
      },
      {
        name: "Manage Account",
        icon: (
          <Icons2.HiWrenchScrewdriver className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        route: "/your-account",
      },
    ],
  },
  {
    title: "Quick Actions",
    links: [
      {
        name: "View All Reports",
        icon: (
          <Icons2.HiClipboardDocumentList className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        action: "view-reports",
      },
      {
        name: "Add Bailiffs",
        icon: (
          <Icons2.HiUserPlus className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        action: "add-bailiffs",
      },
      {
        name: "Assign Clients",
        icon: (
          <Icons2.HiUserGroup className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        action: "view-clients",
      },
      {
        name: "Get Support",
        icon: (
          <Icons.HiHand className="h-7 w-7 text-blue-500 group-hover:text-blue-400" />
        ),
        action: "get-support",
      },
    ],
  },
];
