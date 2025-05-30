import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from "aditya-medium-common";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

userRouter.post('/signup', async (c) => {
	const body = await c.req.json();
	const { success } = signupInput.safeParse(body);
	console.log(success)
	if(!success){
		c.status(411);
		return c.json({
			msg: "Inputs are incorrect"
		})
	}
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password,
				name: body.name,
			}
		});

    const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({jwt});
	
  } catch(e:any) {
		if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
			c.status(400);
			return c.json({
				error: "Email already exists. Please use a different one."
			});
		}
		console.log(e);
		c.status(500);
		return c.json({
			error: "Something went wrong. Please try again later."
		});
	}
})

userRouter.post('/signin', async (c) => {
	
	const body = await c.req.json();
	const { success } = signinInput.safeParse(body);
	if(!success){
		c.status(411);
		return c.json({
			msg: "Inputs are incorrect"
		})
	}
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
				password: body.password
			}
		});
	
		if (!user) {
			c.status(403); //unauthorised
			return c.json({ msg: "Incorrect credentials" });
		}
	
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	
	} catch(e){
		c.status(411);
		return c.text("Invalid")
	}

	})