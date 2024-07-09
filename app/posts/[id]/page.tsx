import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { getSession } from "@/lib/sessions/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

const getCachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
});
async function getCachedLikeStatus(postId: number, userId: number) {
  const cachedOperation = nextCache(
    (postId) => getLikeStatus(postId, userId),
    ["product-like-status"],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cachedOperation(postId);
}

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      // atomic 으로 현재 값을 몰라도 값을 변경할 수 있음
      // 현재 해당하는 views 의 값을 1 증가 시키는 상황
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        // _count 로 하위의 갯수를 파악 가능
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  } catch {
    return null;
  }
}

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const post = await getCachedPost(id);
  if (!post) return notFound();

  // nextCache 와 getSession 을 함께 쓸 수가 없으므로 찢어서 args 로 넘겨서 사용한다!
  const session = await getSession();
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);

  const likePost = async () => {
    "use server";
    try {
      const session = await getSession();
      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });

      revalidateTag(`like-status-${id}`);
    } catch (error) {}
  };

  /**
   * 하지만 해당 방법으로 설계를 하면 사용감 개선이 전혀 되지 않음
   * 서버에서 실행하는 동안 사용자는 요청이 된 건지 요청이 진행 중인 건지 알 수가 없음
   */
  const dislistPost = async () => {
    "use server";
    try {
      const session = await getSession();

      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (error) {}
  };
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <form action={isLiked ? dislistPost : likePost}>
          <button
            className={`${
              isLiked
                ? "bg-orange-500 text-white border-orange-500"
                : "hover:bg-neutral-800"
            } flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors`}
          >
            {isLiked ? (
              <HandThumbUpIcon className="size-5" />
            ) : (
              <OutlineHandThumbUpIcon className="size-5" />
            )}
            {isLiked ? (
              <span>{likeCount}</span>
            ) : (
              <span>공감하기 ({likeCount})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
