import { JSX } from "solid-js/jsx-runtime";

interface Props {
	children: JSX.Element;
}

export default function TableHead(props: Props) {
	return <th>{props.children}</th>;
}
