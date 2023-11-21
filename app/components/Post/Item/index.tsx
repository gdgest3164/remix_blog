import { Box, Space, Text, Title } from "@mantine/core";
import { Link } from "@remix-run/react";
import { TPost } from "~/models/post.service";

interface IPostItem {
  post: TPost;
}

export default function PostItem({ post }: IPostItem) {
  const createAtDate = new Date(post.created_at ?? "");
  const commentCount = (post.comment as unknown as { count: number }[])[0].count;
  return (
    <Box style={{ padding: "15px 0", borderBottom: "1px solid #eaeaea", userSelect: "element" }}>
      <Link to={`/posts/${post.id}`} prefetch="intent">
        <Title order={3}>{post.title}</Title>
        <Space h="xs" />
        <Text lineClamp={3}>{post.content ? post.content.replace(/<[^>]+>/g, "") : "내용이 없습니다."}</Text>
        <Space h="xs" />
      </Link>
      <Box style={{ display: "flex" }}>
        <Text size="xs" c="gary">
          <>댓글 {commentCount}</>
        </Text>
        <Space w="xs" />
        <Text size="xs" c="gray">
          {createAtDate.toLocaleDateString()} {createAtDate.toLocaleTimeString()}
        </Text>
      </Box>
    </Box>
  );
}
