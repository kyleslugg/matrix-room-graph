import { createRoom } from './matrixClientRequests';

const initRoomGraph = async (
  rootRoomId,
  create_children: Array<string> = []
) => {
  let graph = {
    [rootRoomId]: {
      children: []
    }
  };

  for (let room of create_children) {
    let response = await createRoom(room, 'child', []);
    if (response.ok) {
      let result: any = await response.json(); // TODO: type this
      let room_id = result.room_id;
      graph[rootRoomId].children.push(room_id);
      graph[room_id] = {
        children: []
      };
    } else {
      console.error('Error creating room ', room, ': ', response.statusText);
    }
  }
};

export { initRoomGraph };
