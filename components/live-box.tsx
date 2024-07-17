import { getLiveData } from "@/app/(tabs)/live/actions";
import Image from "next/image";
import Link from "next/link";

export default async function LiveBox({ live }: { live: any }) {
  return (
    <Link
      href={`streams/${live.id}`}
      className="gap-5 odd:bg-neutral-800 even:bg-neutral-700 rounded-md cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="text-white p-5">
        {/* <iframe
          src={`https://customer-b56ea6313q42ejr1.cloudflarestream.com/4dca39a5c230d35a81b79bea5e2412a0/iframe?poster=https%3A%2F%2Fcustomer-f33zs165nr7gyfy4.cloudflarestream.com%${live.stream_id}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        ></iframe> */}
        <h2 className="text-lg font-semibold">{live.title}</h2>
        <div>
          <Image
            src={live.user.avatar ? live.user.avatar : ""}
            alt={live.user.username}
            width={50}
            height={50}
            className="size-8 rounded-full"
          />
          <h2>{live.user.username}</h2>
        </div>
      </div>
    </Link>
  );
}
