import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { BrandName } from "./BrandName";
import "./site-header.css";

const navigation = [
  { to: "/", title: "Inicio" },
  { to: "/analizar", title: "Analizador" },
  { to: "/bandeja", title: "Bandeja" },
  { to: "/historial", title: "Historial" },
  { to: "/cuenta", title: "Cuenta" },
  { to: "/como-funciona", title: "Cómo funciona" },
  { to: "/login", title: "Iniciar sesión" },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const currentPage = navigation.find((item) => item.to === pathname)?.title ?? "Inicio";

  useEffect(() => {
    menuRef.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    function dismissOutside(event: PointerEvent) {
      const menu = menuRef.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.removeAttribute("open");
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  function closeMenu() {
    menuRef.current?.removeAttribute("open");
  }

  return (
    <header className="remira-header">
      <div className="page-width remira-header-inner">
        <Link to="/" className="remira-header-brand" aria-label="Remira, inicio">
          <BrandMark />
          <BrandName />
        </Link>
        <nav className="remira-desktop-nav" aria-label="Navegación principal">
          {navigation.map(({ to, title }) => (
            <NavLink key={to} to={to} end className={to === "/login" ? "remira-nav-access" : "remira-nav-link"}>
              {title}
            </NavLink>
          ))}
        </nav>
        <details
          ref={menuRef}
          className="remira-mobile-menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeMenu();
              menuRef.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label={`Abrir navegación. Página actual: ${currentPage}`}>
            <span className="remira-current-page"><small>Estás en</small>{currentPage}</span>
            <Menu size={21} className="remira-menu-icon" aria-hidden="true" />
            <ChevronDown size={18} className="remira-menu-close" aria-hidden="true" />
          </summary>
          <nav aria-label="Navegación móvil">
            {navigation.map(({ to, title }) => (
              <NavLink key={to} to={to} end onClick={closeMenu}>
                <span>{title}</span>
                {to === pathname && <small>Estás aquí</small>}
              </NavLink>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
