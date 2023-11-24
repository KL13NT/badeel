import { JSX } from "solid-js/jsx-runtime";

interface Props {
	children: JSX.Element;
}

export default function TableCell(props: Props) {
	return <td>{props.children}</td>;
}
