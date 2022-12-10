export function unknowErrorCreator<T>(restObj: T) {
  return {
    ...restObj,
    errors: {
      type: "unknown",
    },
  }
}