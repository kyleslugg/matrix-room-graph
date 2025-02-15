import { RoomGraph } from './roomGraph';
import write from 'fs';
import { DB_PATH } from './constants';

const writeRoomGraph = (roomGraph: RoomGraph) => {
  write.writeFileSync(DB_PATH, JSON.stringify(roomGraph));
};

const readRoomGraph = (): RoomGraph => {
  return JSON.parse(write.readFileSync(DB_PATH, 'utf8'));
};

export { writeRoomGraph, readRoomGraph };
