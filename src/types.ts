export type ID = string;

export type Status = "boycott" | "unsure" | "alternative";
export type Filter = Status | "all";

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
	status: Status;
}

export type Product = BaseProduct;

export interface Data {
	products: Record<ID, Product>;
}
