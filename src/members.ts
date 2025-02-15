import { sendMessage } from './matrixClientRequests';
import { RoomGraph } from './roomGraph';

const newMember = async (roomId: string, room_graph: RoomGraph) => {
  const room_children = room_graph.children;

  let options = {};
  for (let room of room_children) {
    options[room_children.indexOf(room)] = room.room_id;
  }

  let options_string = '';
  for (let room of room_children) {
    options_string += `${room_children.indexOf(room)}: "${room.name}"\n `;
  }

  sendMessage(
    roomId,
    `🤖New Member Handler🤖: Welcome to the group! I'll help you
    find other rooms to join and get you started with the group.

    You'll be automatically added to our general chat room. Please
    reply to this message with the number (or numbers) of the group
    (or groups) you'd like to join:
    ${options_string}`,
    { expecting: 'room_numbers', options }
  );
};

const handleMember = async (event) => {
  const { room_graph } = event;
  const { room_id } = event.event;
  const { membership } = event.event.content;

  if (membership === 'join') {
    newMember(room_id, room_graph);
  } else if (membership === 'leave') {
    // Do something else
  } else if (membership === 'invite') {
    // Do something else
  } else {
    // Do something else
  }

  return;
};

export default handleMember;
