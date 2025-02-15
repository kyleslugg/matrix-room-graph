import { sendMessage } from './matrixClientRequests';
const newMember = async (roomId: string) => {
  sendMessage(
    roomId,
    `🤖New Member Handler🤖: Welcome to the group! I'll help you
    find other rooms to join and get you started with the group.

    React to this message with:\n
    ❤️ to join the xyz group\n
    👍 to join the zyx group`
  );
};

const handleMember = async (event) => {
  const { room_id } = event.event;
  console.log('message:', 'SOMEBODY JUST JOINED');
  newMember(room_id);
  return;
};

export default handleMember;
