interface Name {
  display: string;
  sorting: string;
}

export interface Author {
  name: Name;
  nameVariants: Name[];
  _id: string;
}
