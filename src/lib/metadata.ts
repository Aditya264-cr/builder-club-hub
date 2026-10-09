export function pageHead(title: string, description: string, type = 'website') {
 return { meta: [{title:`${title} — Builder Club`},{name:'description',content:description},{property:'og:title',content:`${title} — Builder Club`},{property:'og:description',content:description},{property:'og:type',content:type},{name:'twitter:card',content:'summary_large_image'}] };
}
