import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl">Home Page</h1>
      <Link href="/about">About</Link>
      <br />
      <Link href="/plants">Plants</Link>
    </div>
  );
}
