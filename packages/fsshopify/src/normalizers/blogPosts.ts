export interface Article {
  author?: string;
  image?: string;
  description?: string;
  title?: string;
  publishedAt?: string;
  url?: string;
  id?: string;
  isArticle?: boolean;
  excerpt?: string;
}

export function blogPosts(blogData: any): Article | null {
  if (!(blogData && blogData.node)) {
    return null;
  }

  const author = blogData.node.authorV2 && blogData.node.authorV2.name;
  const image = blogData.node.image && blogData.node.image.originalSrc;

  return {
    author,
    image,
    description: blogData.node.contentHtml,
    excerpt: blogData.node.excerpt,
    title: blogData.node.title,
    publishedAt: blogData.node.publishedAt,
    url: blogData.node.url,
    id: blogData.node.id,
    isArticle: true
  };
}
