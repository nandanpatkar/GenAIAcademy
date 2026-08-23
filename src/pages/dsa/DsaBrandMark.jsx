import React from "react";
import fireDark from "../../assets/dsa/codehelp-fire.gif";
import fireLight from "../../assets/dsa/dsa-fire-light.gif";

/**
 * The animated brand mark ships in two cuts — one drawn for dark surfaces, one
 * for light. Both are rendered and CSS picks the right one off `body.light-theme`,
 * which avoids threading the theme through every consumer.
 */
export default function DsaBrandMark({ className = "" }) {
  return (
    <span className={`dsa-brand-mark ${className}`.trim()} aria-hidden="true">
      <img className="dsa-brand-mark-dark" src={fireDark} alt="" />
      <img className="dsa-brand-mark-light" src={fireLight} alt="" />
    </span>
  );
}
