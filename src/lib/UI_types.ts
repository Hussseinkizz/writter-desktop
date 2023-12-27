export interface SideBarLink {
  name: string;
  icon: JSX.Element;
  route: string;
}

export interface JSXElement {
  children: JSX.Element | JSX.Element[];
}