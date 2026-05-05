import logo from "@/assets/logo-new.png";

export function Logo({ className = "h-12 w-auto border-0 mx-0 object-fill border-none py-px px-px pb-0 pr-0 pl-0 pt-0" }: { className?: string }) {
  return <img src={logo} alt="TAABAL Barra Libre" className={className} />;
}
