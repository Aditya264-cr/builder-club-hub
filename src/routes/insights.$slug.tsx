import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { articles } from '@/lib/content';
import { PageIntro, Blueprint, ArrowUpRight } from '@/components/site';
import { pageHead } from '@/lib/metadata';
export const Route=createFileRoute('/insights/$slug')({loader:({params})=>{const article=articles.find(a=>a.slug===params.slug);if(!article)throw notFound();return article},head:({loaderData})=>pageHead(loaderData?.title||'Article unavailable',loaderData?.description||'This article could not be found.','article'),component:Article});
function Article(){const a=Route.useLoaderData();return <main><PageIntro eyebrow={`${a.category} / ${a.read}`} title={a.title} description={a.description}/><article className="wrap"><div className="article-body"><Blueprint article/><p className="text-xs">Builder Club editorial · Practical perspectives, not professional advice.</p>{a.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.text}</p></section>)}<Link to="/insights" className="textlink mt-10">All insights <ArrowUpRight/></Link></div></article></main>}
