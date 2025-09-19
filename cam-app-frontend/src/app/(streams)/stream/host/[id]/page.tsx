import RoomComponent from "@/components/RoomComponent";

const Room = async ({ params }: { params: Promise<{ id: string }> }) => {
  const roomid = (await params).id;
  return <RoomComponent roomid={roomid} />;
};

export default Room;
