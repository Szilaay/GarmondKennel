import Image from "next/image";

export function BrandLogo({ className }: { className: string }) {
  return (
    <>
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter id="auth-logo-black-to-white" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    -1 0 0 0 1
                    -1 0 0 0 1
                    0 0 0 1 0"
          />
        </filter>
      </svg>
      <div className={`relative ${className}`}>
        <Image
          src="/garmond-logo.png"
          alt="Garmond kennel logó"
          fill
          priority
          sizes="160px"
          className="object-contain"
          style={{ filter: "url(#auth-logo-black-to-white)" }}
        />
      </div>
    </>
  );
}
