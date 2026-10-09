import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact-schema';
const valid = {name:'A learner',email:'learner@example.com',topic:'General enquiry',message:'I would like to learn more.',consent:true,website:''};
describe('Contact validation',()=>{
 it('accepts a complete enquiry',()=>expect(contactSchema.safeParse(valid).success).toBe(true));
 it.each([{email:'invalid'},{name:''},{message:'short'},{topic:'invalid'},{website:'spam'},{consent:false}])('rejects invalid enquiry values %j',override=>expect(contactSchema.safeParse({...valid,...override}).success).toBe(false));
});