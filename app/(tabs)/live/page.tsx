import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { getLiveList } from "./actions";
import LiveBox from "@/components/live-box";

export default async function Live() {
  const liveList = await getLiveList();

  return (
    <div className="flex flex-col gap-2">
      {liveList.map((live) => (
        <LiveBox live={live} key={live.stream_id} />
      ))}

      {/* 추가 버튼 */}
      <Link
        href={`/streams/add`}
        className="bg-emerald-500 rounded-full
      flex items-center justify-center size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-emerald-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
