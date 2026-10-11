import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export interface LocalizedLinkProps extends LinkProps {
  preserveLang?: boolean;
}

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  to,
  children,
  ...props
}) => {
  const { formatPath } = useLanguage();

  let destination = to;
  if (typeof to === "string") {
    // Only localize internal paths (starting with /) and not external links or hash-only
    if (to.startsWith("/") && !to.startsWith("//")) {
      destination = formatPath(to);
    }
  }

  return (
    <RouterLink to={destination} {...props}>
      {children}
    </RouterLink>
  );
};
