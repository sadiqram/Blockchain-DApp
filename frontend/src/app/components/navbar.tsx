import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/cards", label: "Cards" },
  { href: "/my-cards", label: "My Cards" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/auction", label: "Auction" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="text-black font-bold text-lg tracking-wide">
          Fantasy Pokemon NFT Cards
        </div>

        {/* Links */}
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-black hover:text-black transition-colors duration-200 group"
            >
              {link.label}

              {/* black underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
