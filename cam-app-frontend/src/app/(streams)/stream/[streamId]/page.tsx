import "@livekit/components-styles";
import StreamClient from "@/components/StreamClient";

export default async function StreamPage({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const streamId = (await params).streamId;
  // return <>hello</>
  return (
    <StreamClient
      streamId={streamId}
    />
  );
}
