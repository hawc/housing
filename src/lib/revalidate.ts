async function revalidate(url: string): Promise<void> {
  const ENDPOINT =
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:4005/api/revalidate'
      : 'http://localhost:3000/api/revalidate';
  await fetch(
    `${ENDPOINT}?secret=${process.env.REVALIDATION_TOKEN}&url=${url}`,
  );
}

export { revalidate };
