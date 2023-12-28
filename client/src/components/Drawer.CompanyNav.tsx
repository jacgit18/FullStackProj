// @ts-ignore
import settingsIcon from "../assets/icon-settings.svg"

export const companyNavItems = (t: any, userIsCrew: boolean): any[] => {
  return userIsCrew
    ? []
    : [
      {
        icon: settingsIcon,
        route: "/0/settings",
        text: t("Settings"),
      }
    ]
}
