import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "timeago.js";
import HtmlReactParser from "html-react-parser";
import DOMPurify from "dompurify";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Loader from "../components/Loader";

const cleanHtml = (html) => {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return clean.replace(/style="[^"]*"/g, "");
};

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  console.log("Fetched post data:", res.data); // Log the fetched data
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();

  console.log("Current slug:", slug); // Log the current slug

  const {
    isPending,
    error,
    data: post,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    staleTime: 0, // Set to 0 to always fetch fresh data
    cacheTime: 0, // Set to 0 to disable caching
  });

  // Force refetch when component mounts
  useEffect(() => {
    queryClient.invalidateQueries(["post", slug]);
  }, [queryClient, slug]);

  if (isPending) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found!</div>;

  console.log("Rendered post data:", post); // Log the rendered post data

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            {post.user ? (
              <Link
                className="text-blue-800"
                to={`/author/${post.user.username}`}
              >
                {post.user.username}
              </Link>
            ) : (
              <span className="text-blue-800">Team</span>
            )}
            <span>on</span>
            <Link className="text-blue-800" to={`/category/${post.category}`}>
              {post.category}
            </Link>
            <span>{format(post.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{post.desc}</p>
        </div>
        {post.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={post.img} w="600" className="rounded-2xl" />
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          <div>{HtmlReactParser(cleanHtml(post.content))}</div>
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {post.user && post.user.img && (
                <Image
                  src={post.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              {post.user && (
                <Link
                  className="text-blue-800"
                  to={`/author/${post.user.username}`}
                >
                  {post.user.username}
                </Link>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Follow us on all social media platforms below
            </p>
            <div className="flex gap-6">
              <Link
                to="https://web.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-8 h-8 hover:text-blue-500" />
              </Link>
              <Link
                to="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="w-8 h-8 hover:text-gray-400" />
              </Link>
              <Link
                to="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="w-8 h-8 hover:text-blue-900" />
              </Link>
              <Link
                to="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-8 h-8 hover:text-pink-500" />
              </Link>
            </div>
          </div>
          <PostMenuActions post={post} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/category/all">
              All
            </Link>
            <Link className="underline" to="/category/cases">
              Cases
            </Link>
            <Link className="underline" to="/category/reform">
              Reform
            </Link>
            <Link className="underline" to="/category/injustice">
              Injustice
            </Link>
            <Link className="underline" to="/category/commentary">
              Commentary
            </Link>
            <Link className="underline" to="/category/voices">
              Voices
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={post._id} />
    </div>
  );
};

export default SinglePostPage;
