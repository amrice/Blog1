import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import Layout from 'components/Layout'
import Date from 'components/Date'
import BackButton from 'components/Backbutton'
import { getPostsListByTag, getAllTags } from 'lib/posts'

export default function TaggedPosts({ posts, tag }) {
	
	const { t } = useTranslation('common')
	const postsWithTag = t('PostsWithTag')

	return (
		<Layout>
			<h1 className="text-3xl font-semibold mb-4 text-center">{postsWithTag}: {tag}</h1>
			<ul className="grid grid-cols-1 gap-4">
				{posts.map((post) => (
					<li
						key={post.slug}
						className="bg-white shadow-lg rounded-lg p-6 mb-4 dark:bg-gray-600 dark:text-gray-100 mx-auto max-w-4xl w-full"
					>
						<h3 className="text-xl font-semibold mb-4">
							<Link href={`/${post.year}/${post.month}/${post.slug}`}>
								{post.title}
							</Link>
						</h3>
						<small className="text-gray-600 dark:text-gray-100">
							<Date dateString={post.date} />
						</small>
						<p className="text-gray-700 mt-2 dark:text-gray-100">{post.summary}</p>
					</li>
				))}
			</ul>
			<div className=" flex justify-center items-center mt-4">
				<BackButton />
			</div>
		</Layout>
	)
}


export async function getStaticPaths({locales}) {
	const tags = getAllTags()
	const paths = tags.map((tag) => locales.map(locale => ({ params: { tag }, locale }))).flat()
	return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
	const posts = getPostsListByTag(params.tag)

	return {
		props: {
			posts,
			tag: params.tag,
		},
	}
}