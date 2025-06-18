import { IconProps } from "@/types/common";

export const LogoIcon = ({
  className,
  width = 100,
  height = 100,
  color = "currentColor",
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 73 73"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clip-path="url(#clip0_2_2)">
      <path
        d="M71 36.5C71 55.5538 55.5538 71 36.5 71C17.4462 71 2 55.5538 2 36.5C2 17.4462 17.4462 2 36.5 2C55.5538 2 71 17.4462 71 36.5ZM14.363 36.5C14.363 48.726 24.274 58.637 36.5 58.637C48.726 58.637 58.637 48.726 58.637 36.5C58.637 24.274 48.726 14.363 36.5 14.363C24.274 14.363 14.363 24.274 14.363 36.5Z"
        fill={color}
      />
      <path
        d="M73 36.5C73 56.6584 56.6584 73 36.5 73C16.3416 73 0 56.6584 0 36.5C0 16.3416 16.3416 0 36.5 0C56.6584 0 73 16.3416 73 36.5ZM0.965561 36.5C0.965561 56.1251 16.8749 72.0344 36.5 72.0344C56.1251 72.0344 72.0344 56.1251 72.0344 36.5C72.0344 16.8749 56.1251 0.965561 36.5 0.965561C16.8749 0.965561 0.965561 16.8749 0.965561 36.5Z"
        fill={color}
      />
    </g>
    <defs>
      <clipPath id="clip0_2_2">
        <rect width="73" height="73" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
