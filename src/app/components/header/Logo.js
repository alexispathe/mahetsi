import Link from 'next/link';

export default function Logo({ isHovered, textColor }) {
  return (
    <div className="text-lg font-bold">
      <Link href="/">
        <span className={`${isHovered ? "text-black" : textColor} text-xl`}>
          Mahets&#39;i & Boh&#39;o
        </span>
      </Link>
    </div>
  );
}
