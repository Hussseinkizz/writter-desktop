import usePosts from './usePosts';
import { UseQueryResult } from '@tanstack/react-query';

interface Post {
  id: string;
  title: string;
  body: string;
}

const PostList = () => {
  const { data, isLoading, isError, error } = usePosts() as UseQueryResult<Post[], unknown>;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      {data.map((post: Post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
