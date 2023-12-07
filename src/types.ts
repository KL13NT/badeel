export type ID = string;

export type Status = "boycott" | "unsure" | "alternative";
export type Filter = Status | "all";

export interface Organization {
	name: string;
	country: string;
	parentOrganizations: ID[];
}

export interface BaseProduct {
	status: Status;
	Name: string;
	"English Name": string;
	Manufacturer: string;
	Category: string;
}

export interface BoycottProduct extends BaseProduct {
	status: "boycott";
	Proof: string;
	Link?: string;
}

export interface UnsureProduct extends BaseProduct {
	status: "unsure";
	ref: number;
}

export interface SupportProduct extends BaseProduct {
	status: "alternative";
	Contact?: string;
}

export type Product = BoycottProduct | UnsureProduct | SupportProduct;

export interface Data {
	products: Record<ID, Product>;
}

export interface Category {
	english: string;
	arabic: string;
	major?: string;
}

export interface FuseIndex {
	docs: Product[];
}
