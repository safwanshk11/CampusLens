export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
};

export type NavGroup = {
  readonly title: string;
  readonly items: readonly NavItem[];
};
