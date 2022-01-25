import { SVGProps } from "react";

export default function BarcodeIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  let color = props.color ? props.color : "currentColor";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        fill={color}
        d="M2 4h2v16H2V4zm4 0h2v16H6V4zm3 0h3v16H9V4zm4 0h2v16h-2V4zm3 0h2v16h-2V4zm3 0h3v16h-3V4z"
      />
    </svg>
  );
}
