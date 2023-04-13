import Head from 'next/head'
import Link from 'next/link'
import readingTime from 'reading-time'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArticleIcon from '@mui/icons-material/Article'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArticleLayout from 'components/ArticleLayout'
import Date from 'components/Date'
import ArticleToc from 'components/ArticleToc'
import ChatGPTSummary from 'components/ChatGPTSummary'
import Backbutton from 'components/Backbutton'
import Comment from 'components/Comment'
import ScrollToTop from 'components/ScrollToTop'
import { getAllPostMetadata, getPostDataByFileName } from 'lib/posts'
import config from 'config'


export default function Post({ postData, params,stats}) { 
	return (
		<ArticleLayout>
			{/* 标题 */}
			<Head>
				<title>{postData.title}</title>
			</Head>

			{/* 主体 */}
			<div className="flex flex-col md:grid md:grid-cols-6 md:gap-2">
				{/* chatgpt总结 */}
				<div className="md:col-span-1 order-1 md:order-1">
					<div className='md:sticky top-1/4 bottom-1/4 p-2 bg-gray-300 shadow-lg rounded-md dark:text-gray-900 mx-auto md:mx-0 w-full md:w-auto'>
						<ChatGPTSummary contentMarkdown={postData.contentMarkdown} params={params} tags={postData.tags} />
					</div>
				</div>

				<div className="col-span-5 mx-auto md:mx-10 order-2 md:order-2 p-4">
					<div className="grid grid-cols-5 gap-4">
						{/* 文章内容 */}
						<article className="col-span-5 md:col-span-4 leading-relaxed tracking-wide">
							<h1 className="text-3xl font-semibold text-center my-3">{postData.title}</h1>
							<div className="flex flex-wrap text-base my-3">
								<div className="text-right flex-1">
									<ArticleIcon />{' '}{stats.words} words
								</div>
								<div className="text-right flex-1">
									<AccessTimeIcon />{' '}{Math.ceil(stats.minutes)} min
								</div>
								<div className="text-right flex-1">
									<CalendarTodayIcon />{' '}<Date dateString={postData.date} format='YYYY-M-D' />
								</div>
								<div className="text-right flex-1 hidden md:block">
									<a href={`${config.githubRepo}/edit/main/posts/${encodeURIComponent(postData.filename)}`} className='hover:text-blue-800' target='_blank'>
										Edit This Page
									</a>
								</div>
							</div>

							<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
							<div className="my-3">
								<span className="font-bold">Tags:{' '}</span>
								{postData.tags.map((tag, index) => (
									<Link
										key={index}
										className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
										href={`/tags/${tag}`}>
										{tag}
									</Link>
								))}
							</div>
							<div className="my-12 mx-0">
								<Backbutton />
							</div>
							<Comment />
						</article>

						{/* 文章目录 */}
						<div className="hidden md:hidden lg:col-span-1">
							<ArticleToc contentMarkdown={postData.contentMarkdown} showtoc={postData.showtoc} />
						</div>
					</div>
				</div>
			</div>
			{/* 回到顶部 */}
			<ScrollToTop />
		</ArticleLayout>
	)
}

export async function getStaticPaths() {
	const allPostMetadata = getAllPostMetadata()
	const paths = allPostMetadata.map((post) => {
		return {
			params: {
				year: post.year.toString(),
				month: post.month.toString().padStart(2, '0'),
				slug: post.slug,
			},
		}
	})

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params }) {
	const postData = await getPostDataByFileName(params.year, params.month, params.slug)
	const contentHtml = postData.contentHtml
	const stats = readingTime(contentHtml)
	return {
		props: {
			postData,
			params,
			stats,
		},
	}
}
