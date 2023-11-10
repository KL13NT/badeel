import Fuse from "fuse.js";
import { For, Show, batch, createSignal, onMount } from "solid-js";
import { BaseProduct, Product } from "./types";
import { csvParse } from "d3-dsv";
import { FuseResult } from "fuse.js";

interface View {
	type: "proof" | "default";
	content?: string;
}

let productFuse: null | Fuse<Product> = null;
let searchThrottleTimeout: number = 0;

function App() {
	const [results, setResults] = createSignal<FuseResult<BaseProduct>[]>([]);
	const [currentView, setCurrentView] = createSignal<View>({
		type: "proof",
		content: "منتج سعودي",
	});

	onMount(async () => {
		const requests = [
			fetch(
				"https://docs.google.com/spreadsheets/d/1chPpWQa_zRAgLIS1RtNyKnDayGyEndG4Sqg-KmGqIuo/export?format=csv&gid=1503994404"
			),

			fetch(
				"https://docs.google.com/spreadsheets/d/1chPpWQa_zRAgLIS1RtNyKnDayGyEndG4Sqg-KmGqIuo/export?format=csv&gid=641903355"
			),
		];

		const [boycottResponse, nonBoycottResponse] = await Promise.all(requests);

		const boycottText = await boycottResponse.text();
		const nonBoycottText = await nonBoycottResponse.text();

		const boycottParsed = csvParse(boycottText) as unknown as Product[];
		const nonBoycottParsed = csvParse(nonBoycottText) as unknown as Product[];

		const data = boycottParsed
			.map((product) => ({
				...product,
				boycott: true,
			}))
			.concat(
				nonBoycottParsed.map((product) => ({
					...product,
					boycott: false,
				}))
			);

		productFuse = new Fuse(data, {
			keys: ["Name", "English Name", "Manufacturer"],
			includeScore: true,
			findAllMatches: false,
		});
	});

	const handleInput = (ev: InputEvent) => {
		const { value } = ev.currentTarget as HTMLInputElement;

		clearTimeout(searchThrottleTimeout);

		searchThrottleTimeout = setTimeout(() => {
			if (!productFuse) return;

			const t0 = performance.now();

			const result = productFuse.search(value).slice(0, 10);

			const t1 = performance.now();
			console.log(`Searching took ${t1 - t0} milliseconds.`);

			batch(() => {
				setResults(result);
				setCurrentView({
					type: "default",
					title: value,
				});
			});
		}, 250);
	};

	const showProof = (product: Product) => {
		setCurrentView({
			type: "proof",
			content: product.Proof,
		});
	};

	const closeProof = (ev: MouseEvent) => {
		if (ev.target !== ev.currentTarget) {
			return;
		}

		setCurrentView({
			type: "default",
		});
	};

	return (
		<>
			<section>
				<h1>بديل</h1>
				<p>
					بديل هو موقع مصري لتسهيل مقاطعة المنتجات الصهيونية وتوفير البدائل
					المحلية. الشروط الآتية يجب توافرها:
				</p>
				<ul>
					<li>منتجات داعمة للصهيونية</li>
					<li>
						منتجات في دول داعمة للصهيونية, مثل المنتجات الأمريكية, البريطانية,
						الخ
					</li>
					<li>منتجات استغلت الأحداث الحاصلة في فلسطين </li>
				</ul>

				<p>
					:::تحذير::: غياب احد المنتجات من القائمة الخاصة بنا يعني اننا لا علم
					لنا عما اذا كانت مقاطعة ام لا.
				</p>

				<input
					name="search"
					type="text"
					placeholder="اكتب اسم منتج او شركة"
					id="search-input"
					onInput={handleInput}
				/>

				{currentView().content && currentView().type === "proof" ? (
					<div
						class="fixed w-full h-full top-0 left-0 proof-container"
						role="alert"
						onClick={closeProof}
					>
						<div class="w-2/5 h-fit p-4 proof">
							<button class="order-2" onClick={closeProof}>
								Close
							</button>
							<p class="order-1">{currentView().content}</p>
						</div>
					</div>
				) : null}

				<table class="table">
					<thead class="thead">
						<tr>
							<th class="td">مقاطعة</th>
							<th class="td">اسم المنتج</th>
							<th class="td">الاسم بالإنجليزية</th>
							<th class="td">الشركة المصنّعة</th>
							<th class="td">الدليل</th>
						</tr>
					</thead>

					<tbody class="tbody">
						<For each={results()}>
							{(result) => {
								return (
									<tr>
										<td class="td">
											{result.item.boycott ? "قاطع" : "لا تقاطع"}
										</td>
										<td class="td">{result.item.Name}</td>
										<td class="td">{result.item["English Name"]}</td>
										<td class="td">{result.item.Manufacturer}</td>
										<td class="td">
											<Show
												when={result.item.boycott}
												fallback={"ليس ضمن المقاطعة"}
											>
												<button onClick={[showProof, result.item]}>
													الدليل
												</button>
											</Show>
										</td>
									</tr>
								);
							}}
						</For>
					</tbody>
				</table>
			</section>
		</>
	);
}

export default App;
