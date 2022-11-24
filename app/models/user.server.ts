import { LinearClient, LinearError } from "@linear/sdk";
import bcrypt from "bcryptjs";
import type { Password, User } from "@prisma/client";
import type { LinearFetch, Issue } from "@linear/sdk";
import type { LightIssue } from "~/routes/daily-standup";

import { prisma } from "~/db.server";

export type { User, Post } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getUserLinearIssuesByApiKey(apiKey: string) {
  const linearClient = new LinearClient({
    apiKey,
  })
  async function getMyIssues(linearClient: LinearClient): LinearFetch<Issue[]> {
    const me = await linearClient.viewer;

    const myIssues = await me.assignedIssues({
      filter: {
        cycle: {
          or: {
            isPrevious: {
              eq: true,
            },
            isActive: {
              eq: true,
            },
          },
        },
      },
    });

    return myIssues.nodes;
  }

  try {
    const issues = await getMyIssues(linearClient);
    const prepared: LightIssue[] = issues.map((issue) => ({
      id: issue.id,
      url: issue.url,
      identifier: issue.identifier,
      title: issue.title,
      branchName: issue.branchName,
    }));

    return {
      issues: prepared,
    };

  } catch (error) {
    if (error instanceof LinearError) {
    		error.errors?.map((graphqlError) => {
    			console.log('Error message', graphqlError.message);
    			console.log('LinearErrorType of this GraphQL error', graphqlError.type);
    			console.log('Error due to user input', graphqlError.userError);
    			console.log('Path through the GraphQL schema', graphqlError.path);
    		});
    		// TODO handle linear error
    		return {
          issues: [],
    			errors: {
    				message: error.message,
    				type: 'linear'
    			},
    		};
    }
    return {
      issues: [],
      errors: {
        type: 'unknown'
      }
    }
  }
}

export async function updateLinearApiKey({
  id,
  linearApiKey,
}: {
  id: User['id'];
  linearApiKey: string;
}) {
  return prisma.user.update({ where: { id }, data: { linearApiKey }})
}