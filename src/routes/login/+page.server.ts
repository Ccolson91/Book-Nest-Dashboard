import { fail, redirect } from "@sveltejs/kit";


interface ReturnObject {
  success: boolean;
  errors: string[];
  email: string;
  password: string;
  passwordConfirmation?: never;
  name?: never;
}


export const actions = {
    default: async ({request, locals: {supabase}}) => {
        // going to do something with the given event
        const formData = await request.formData();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

         const returnObject: ReturnObject = {
            success: true,
            email,
            password,
            errors: [],
            };

        

    if (!email.length) {
      returnObject.errors.push("Email is required.");
    }

    if (!password.length) {
      returnObject.errors.push("Password is required.");
    }


    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }
    
    // sign in using password flow


    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        returnObject.success = false;
        return fail(400, returnObject as any);
    }

    redirect(303, "private/dashboard")

    }
}