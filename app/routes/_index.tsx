import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Box, Button, Divider, Title } from "@mantine/core";
import { Link, useLoaderData } from "@remix-run/react";
import List from "~/components/List";
import PostItem from "~/components/Post/Item";
import { TPost, getPosts } from "~/models/post.service";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

interface ILoaderData {
  posts: Array<TPost>;
}

export const loader: LoaderFunction = async () => {
  const getPostResponse = await getPosts();
  return json<ILoaderData>({
    posts: (getPostResponse.data as unknown as Array<TPost>) ?? [],
  });
};

export default function Index() {
  const loaderData = useLoaderData<ILoaderData>();
  const [posts] = useState(loaderData.posts);
  return (
    <Box style={{ padding: "45px" }}>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Title>나만의 블로그</Title>
        <Link to="/posts/create">
          <Button variant="light" color="red">
            글쓰기
          </Button>
        </Link>
      </Box>
      <Divider mt={20} mb={15} />
      <List>
        {posts.map((post: TPost, i: any) => (
          <PostItem key={i} post={post as TPost}></PostItem>
        ))}
      </List>
    </Box>
  );
}
