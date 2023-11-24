import { JSX } from "solid-js/jsx-runtime";

interface Props {
	children: JSX.Element;
}

export default function Table(props: Props) {
	return <table>{props.children}</table>;
}
