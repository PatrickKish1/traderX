import Image from "next/image"
import { type Token } from "@/config/tokens"

interface TokenIconProps {
  token: Token
  size?: number
  className?: string
}

const TokenIcon = ({ token, size = 40, className = "" }: TokenIconProps) => {
  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={token.imageUrl}
        alt={token.name}
        width={size}
        height={size}
        className={token.isObstacle ? "opacity-80" : ""}
      />
      {token.isObstacle && (
        <div className="absolute inset-0 bg-red-500/50" />
      )}
    </div>
  )
}

export default TokenIcon
