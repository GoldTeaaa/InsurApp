import { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export type NavLink = {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>>;
  children?: never;
};

export type NavGroup = {
  label: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>>;
  children: { href: string; label: string }[];
  href?: never;
};

export type NavItem = NavLink | NavGroup;