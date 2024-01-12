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
	id: string;
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

export type SortOption =
	| "Name"
	| "English Name"
	| "status"
	| "Category"
	| "accuracy";

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

export type View = "cards" | "table";

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
export interface BeforeInstallPromptEvent extends Event {
	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;
}
