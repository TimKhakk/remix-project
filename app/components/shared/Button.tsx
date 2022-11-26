import classNames from "classnames";
import type { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "common";
  className?: string;
  children: React.ReactNode;
}

export const Button: FC<Props> = ({
  children,
  variant = "common",
  className,
  ...props
}) => {
  return (
    <button
      className={classNames(
        "rounded border border-app-primary-900 px-2 py-1 transition text-sm",
        className,
        {
          "bg-app-primary-600 hover:bg-app-primary-700": variant === "primary",
          "bg-app-primary-900 hover:bg-app-primary-700": variant === "common",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};
