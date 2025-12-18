"use client";

import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Rocket,
  CarTaxiFront,
  BookOpenText,
  User,
  CircleUser,
  ChartPie,
  CircleDollarSign,
  ChartColumn,
  Megaphone,
  Headphones,
  Building,
  Settings2,
  Car,
  Map,
  LandPlot,
  Tag,
  ReceiptText,
  Send,
  CarFront,
  Bell,
  CalendarCheck,

} from "lucide-react";

import { FiChevronDown, FiSettings } from "react-icons/fi";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },

  {
    title: "Cab",
    dropdown: true,
    icon: Car,
    children: [
      { title: "Services", url: "/cab/services" },
      { title: "Vehicles", url: "/cab/vehicles" },
    ],
  },
  {
    title: "Users",
    dropdown: true,
    icon: User,
    children: [
      { title: "All Users", url: "/users/all-users" },
      { title: "Add Users", url: "/users/add-user" },
      { title: "Roles and Permissions", url: "/users/roles-permissions" },
    ],
  },

  {
    title: "Drivers",
    dropdown: true,
    icon: CarFront,
    children: [
      { title: "List", url: "/driver/list" },
      { title: "Pending Verification", url: "/driver/pending-verification" },
      { title: "Settings", url: "/driver/settings" },
    ],
  },
  { title: "Dispatcher", url: "/dispatcher", icon: Rocket },
  { title: "Fleets", url: "/fleets", icon: Building },
  { title: "Zones", url: "/zones", icon: LandPlot },
  { title: "Preference", url: "/preferences", icon: Settings2 },
  { title: "Heat Map", url: "/heatmap", icon: Map },
  { title: "SOS", url: "/sos", icon: Megaphone },
  {
    title: "Coupons",
    icon: ReceiptText,
    url: "/Coupons"

  },
  { title: "Surge Price", url: "/surge-price", icon: Tag },
  {
    title: "Book trip",
    dropdown: true,
    icon: CalendarCheck,
    children: [
      { title: "Booking", url: "/book-trip" },
      { title: "Booking History", url: "/book-trip/history" },
    ],
  },
  {
    title: "Push Notification",
    dropdown: true,
    icon: Bell,
    children: [
      { title: "All Push Notification", url: "/push-notification" },
      { title: "Send Push Notification", url: "/push-notification/create" },
    ],
  },

  { title: "Orders", url: "/orders", icon: BookOpenText },
  { title: "Customers", url: "/customers", icon: CircleUser },

  {
    title: "Marketing",
    dropdown: true,
    icon: ChartPie,
    children: [
      { title: "Coupons", url: "/marketing/coupons" },
      { title: "Gift Cards", url: "/marketing/giftcards" },
      { title: "Annoucements", url: "/marketing/annoucements" },
    ],
  },

  {
    title: "Payout",
    dropdown: true,
    icon: CircleDollarSign,
    children: [
      { title: "Payout Methods", url: "/payout/payout-methods" },
      { title: "Driver Payout", url: "/payout/driver-payout" },
    ],
  },

  {
    title: "Accounting",
    dropdown: true,
    icon: ChartColumn,
    children: [
      { title: "Admin", url: "/accounting/admin" },
      { title: "Customer", url: "/accounting/customer" },
      { title: "Driver", url: "/accounting/driver" },
    ],
  },


  { title: "Support", url: "/support", icon: Headphones },




  // {
  //   title: "Management",
  //   dropdown: true,
  //   icon: Settings2,
  //   children: [
  //     { title: "Cancel Reasons", url: "/management/teams" },
  //     { title: "Pricing", url: "/management/roles" },
  //     { title: "Rating Points", url: "/management/reports" },
  //     { title: "Vehicles", url: "/management/reports" },
  //     { title: "Regions", url: "/management/reports" },
  //     { title: "Payment Gateways", url: "/management/reports" },
  //     { title: "SMS Provider", url: "/management/reports" },
  //     { title: "Staffs", url: "/management/reports" },
  //   ],
  // },

  // { title: "Settings", url: "/settings", icon: FiSettings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="lg:fixed lg:top-20 lg:left-0 lg:h-[calc(100vh-5rem)] lg:w-65 w-full bg-blue-950 dark:bg-black shadow-none lg:shadow ">
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-[18px] ml-3 mb-8 font-normal dark:text-white">
            Better Taxi
          </SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* DROPDOWN MENU */}
                  {item.dropdown ? (
                    <details className="group mb-2">
                      <summary className="flex items-center justify-between gap-2 cursor-pointer py-2 px-2 rounded-md hover:text-blue-800">
                        <span className="flex items-center gap-2 text-[14px] text-gray-500 dark:text-white">
                          <item.icon className="text-[10px] dark:text-white" />
                          {item.title}
                        </span>
                        <FiChevronDown className="transition-transform group-open:rotate-180" />
                      </summary>

                      {/* CHILD LINKS */}
                      <div className="ml-6 mt-1">
                        <ul className="space-y-2">
                          {item.children.map((sub) => {
                            const active = pathname === sub.url;
                            return (
                              <li key={sub.title}>
                                <a
                                  href={sub.url}
                                  className={`block px-2 py-1 rounded-md text-[15px] dark:text-white
                                    ${active
                                      ? "bg-blue-600 text-white font-medium"
                                      : "text-gray-500 hover:text-blue-700"
                                    }
                                  `}
                                >
                                  {sub.title}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </details>
                  ) : (
                    /* NORMAL SIDEBAR ITEM (NO DROPDOWN) */
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 px-2 py-2 rounded-md transition-colors dark:text-white
                          ${pathname === item.url
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-blue-700"
                          }
                        `}
                      >
                        <item.icon
                          className={`text-[14px] dark:text-white${pathname === item.url ? "text-white" : "text-gray-500"
                            }`}
                        />

                        <span
                          className={`text-[14px] dark:text-white${pathname === item.url ? "text-white" : "text-gray-500"
                            }`}
                        >
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
