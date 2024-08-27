type Vaccine = {
  type: string;
  dateAdministered: string;
};

export type Cat = {
  id: number;
  name: string;
  age: number;
  breed: string;
  vaccinations: Vaccine[];
  picture?: string;
};
