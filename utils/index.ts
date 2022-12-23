export const swrFetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);

  if (!res.ok) {
    const error = new SwrFetcherError({
      message: "An error occured while fetching the data",
      info: await res.json(),
      status: res.status,
    });

    throw error;
  }

  return await res.json();
};

class SwrFetcherError extends Error {
  info;
  status;
  constructor(params: { message: string; info: object; status: number }) {
    const { message, info, status } = params;
    super(message);
    this.info = info;
    this.status = status;
  }
}
