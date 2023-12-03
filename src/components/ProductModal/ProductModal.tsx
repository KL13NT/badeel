import { useProductModal } from "~stores/product-modal";
import { Show, batch, createEffect } from "solid-js";
import Button from "~components/Button/Button";
import t from "~utils/messages";
import { Transition } from "solid-transition-group";

import styles from "./ProductModal.module.scss";
import clsx from "clsx";
import Badge from "~components/Badge/Badge";
import { Product, Status } from "~types";
import { UNSURE_SOURCE_URL } from "~constants/documents";
import { useSearchQuery } from "~hooks/useSearchQuery";
import { getCategoryMajor } from "~utils/categories";

const getCellURL = (ref: number) => `${UNSURE_SOURCE_URL}&range=A${ref}`;

const proofMapping = {
	Arab: t("proof.content.arab"),
	Supporter: t("proof.content.supporter"),
	Foreign: t("proof.content.foreign"),
};

const statusMapping: Record<Status, string> = {
	alternative: t("status.alternative"),
	boycott: t("status.boycott"),
	unsure: t("status.unsure"),
};

type proofMappingKey = keyof typeof proofMapping;

interface Props {
	product: Product;
}

const Proof = (props: Props) => {
	return (
		<>
			{props.product.status === "boycott" ? (
				<div class={styles.proof}>
					<p class={clsx("t-button")}>{t("proof.title.boycott")}</p>
					<p class={clsx("t-body")}>
						{proofMapping[props.product.Proof as proofMappingKey] ??
							props.product.Proof}
					</p>
				</div>
			) : null}

			{props.product.status === "alternative" ? (
				<div class={styles.proof}>
					<p class={clsx("t-button")}>{t("proof.title.support")}</p>
					<p class={clsx("t-body")}>{t("proof.content.alternative")}</p>
				</div>
			) : null}

			{props.product.status === "unsure" ? (
				<div class={styles.proof}>
					<p class={clsx("t-button")}>{t("proof.title.context")}</p>
					<p class={clsx("t-body")}>{t("proof.content.unsure")}</p>
				</div>
			) : null}
		</>
	);
};

interface FooterActionsProps {
	product: Product;
	showAlternatives: () => void;
}

const FooterActions = (props: FooterActionsProps) => {
	return (
		<>
			{props.product.status === "boycott" ? (
				<Button variant="action" onClick={props.showAlternatives}>
					عرض البدائل
				</Button>
			) : null}

			{props.product.status === "boycott" && props.product.Link ? (
				<Button
					as="a"
					target="_blank"
					href={props.product.Link}
					variant="action-invert"
				>
					عرض الدليل
				</Button>
			) : null}

			{props.product.status === "alternative" && props.product.Contact ? (
				<Button
					as="a"
					target="_blank"
					href={props.product.Contact}
					variant="action"
				>
					{t("contact")}
				</Button>
			) : null}

			{props.product.status === "unsure" ? (
				<Button
					as="a"
					target="_blank"
					href={getCellURL(props.product.ref)}
					variant="action"
				>
					{t("source")}
				</Button>
			) : null}
		</>
	);
};

let ref: HTMLDivElement | undefined;
export default function ProductModal() {
	const [productModal, setProductModal] = useProductModal();
	const { params, updateParams } = useSearchQuery();

	const close = () => {
		setProductModal({
			product: null,
		});
	};

	const handleKeyUp = (ev: KeyboardEvent) => {
		if (ev.key.toLowerCase() === "escape") {
			close();
		}
	};

	const showAlternatives = () => {
		if (!productModal.product) return;

		const major = getCategoryMajor(productModal.product?.Category);

		batch(() => {
			setProductModal({
				product: null,
			});

			updateParams({
				...params,
				query: undefined,
				sub: productModal.product?.Category,
				major: major.english,
				status: "alternative",
			});
		});
	};

	const product = () => productModal.product!;

	createEffect(() => {
		if (productModal.product && ref) {
			ref.focus();
		}
	});

	return (
		<Transition name="slide-fade">
			<Show when={product()}>
				<div
					role="dialog"
					aria-modal="true"
					id="product-modal"
					class={styles.dialog}
					ref={ref}
					tabIndex="-1"
					onKeyUp={handleKeyUp}
				>
					<div class={styles.body}>
						<div class={styles.header}>
							<p class={clsx("t-button", styles.name)}>{product().Name}</p>
							<p class={clsx("t-body", styles.englishName)}>
								{product()["English Name"]}
							</p>
						</div>

						<div class={styles.content}>
							<div class={styles.meta}>
								<Badge variant={product().status}>
									{statusMapping[product().status]}
								</Badge>
							</div>

							<div class={styles.proof}>
								<p class={clsx("t-button")}>{t("manufacturer")}</p>
								<p class={clsx("t-body")}>
									{product().Manufacturer.length > 0
										? product().Manufacturer
										: "غير متوفر"}
								</p>
							</div>

							<Proof product={product()} />

							<div class={styles.footer}>
								<FooterActions
									product={product()}
									showAlternatives={showAlternatives}
								/>
								<Button
									id="close"
									aria-label="close dialog"
									variant="action-invert"
									onClick={close}
								>
									أغلق النافذة
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Show>
		</Transition>
	);
}
