import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-center bg-gray-300">
      <ul className=" flex flex-row ">
        <li className="p-2 hover:bg-blue-50">
          <Link href="/">Home</Link>
        </li>
        <li className="p-2 hover:bg-blue-50">
          <a href="/about">About</a>
        </li>
      </ul>
    </div>
  );
}
