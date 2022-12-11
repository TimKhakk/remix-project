import dayjs from "dayjs";

export const dateFormatter = (date: string) => dayjs(date).format("MMM D");
