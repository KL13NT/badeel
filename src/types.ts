export type ID = string;

export interface Organization {
	name: string;
	country: string;
	parentOrganizations: ID[];
}

export interface BaseProduct {
	Name: string;
	"English Name": string;
	Manufacturer: string;
	Proof: string;
	boycott: boolean;
}

export type Product = BaseProduct;

export interface Data {
	products: Record<ID, Product>;
}
