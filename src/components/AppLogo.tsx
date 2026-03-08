import nuclearSymbol from "/img/nuclear-symbol.png";

interface AppLogoProps {
  size?: number;
}

export function AppLogo({ size = 56 }: AppLogoProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-black bg-yellow-400"
      style={{ width: size, height: size }}
    >
      <img
        src={nuclearSymbol}
        alt="Snrub Corp"
        width={size * 0.65}
        height={size * 0.65}
      />
    </div>
  );
}
