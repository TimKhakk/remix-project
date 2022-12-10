import type { LinearError } from '@linear/sdk';

export function linearErrorLogger(error: LinearError) {
  error.errors?.forEach((graphqlError) => {
    console.log("Error message", graphqlError.message);
    console.log("LinearErrorType of this GraphQL error", graphqlError.type);
    console.log("Error due to user input", graphqlError.userError);
    console.log("Path through the GraphQL schema", graphqlError.path);
  });
}