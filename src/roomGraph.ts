import { createRoom, leaveAndForgetRoom } from './matrixClientRequests';
import { existsSync } from 'fs';
import { DB_PATH } from './constants';
import { readRoomGraph, writeRoomGraph } from './db';

interface RoomGraph {
  name: string;
  room_id: string;
  children: Array<RoomGraph>;
}

const initRoomGraph = async (
  rootRoomId: string,
  create_children: Array<string> = [],
  overwrite: boolean = false
): Promise<RoomGraph> => {
  if (existsSync(DB_PATH)) {
    let graph: RoomGraph = readRoomGraph();
    if (overwrite) {
      console.log('Overwriting room graph');
      for (let room of graph[rootRoomId].children) {
        await leaveAndForgetRoom(room.room_id);
      }
    } else {
      console.log('Reading room graph from file');
      return graph;
    }
  }

  let graph: RoomGraph = {
    name: 'root',
    room_id: rootRoomId,
    children: []
  };

  for (let room_name of create_children) {
    let response = await createRoom(room_name, 'child', []);
    if (response.ok) {
      let result: any = await response.json(); // TODO: type this
      let room_id = result.room_id;

      // Construct the child room graph and push it to the root room graph's children array
      graph.children.push({
        name: room_name,
        room_id,
        children: []
      });
    } else {
      console.error(
        'Error creating room ',
        room_name,
        ': ',
        response.statusText
      );
    }
  }
  writeRoomGraph(graph);
  return graph;
};

export { initRoomGraph, RoomGraph };
