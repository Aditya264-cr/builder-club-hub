import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { contactSchema } from './contact-schema';
export const submitContact = createServerFn({method:'POST'}).inputValidator((input:unknown)=>contactSchema.parse(input)).handler(async({data})=>{
 const request=getRequest();
 const origin=request.headers.get('origin');
 if(origin && origin!==new URL(request.url).origin) return {ok:false,message:'Please submit from the Builder Club website.'};
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 // Public intake is intentionally unauthenticated: validation, honeypot and atomic durable limits gate privileged insert.
 const ip=request.headers.get('cf-connecting-ip') || 'unknown';
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
 const bucket=Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,'0')).join('');
 const {data:allowed,error:limitError}=await supabaseAdmin.rpc('consume_contact_limit',{p_bucket:bucket});
 if(limitError) return {ok:false,message:'Enquiries are temporarily unavailable. Please try again later.'};
 if(!allowed) return {ok:false,message:'Too many enquiries. Please try again in an hour.'};
 const {data:emailAllowed,error:emailLimitError}=await supabaseAdmin.rpc('consume_contact_limit',{p_bucket:`email:${data.email.toLowerCase()}`});
 if(emailLimitError || !emailAllowed) return {ok:false,message:'Too many enquiries. Please try again in an hour.'};
 const {error}=await supabaseAdmin.from('contact_submissions').insert({name:data.name,email:data.email,topic:data.topic,message:data.message});
 if(error) return {ok:false,message:'Your enquiry could not be saved. Please try again later.'};
 return {ok:true,message:'Your enquiry has been received. Thank you for getting in touch.'};
});
