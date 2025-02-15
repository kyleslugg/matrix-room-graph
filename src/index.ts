import 'dotenv/config';
import * as sdk from 'matrix-js-sdk';
import { RoomEvent, ClientEvent } from 'matrix-js-sdk';
import handleMessage from './messages';
import handleReaction from './reactions';
import handleMember from './members';
import { initRoomGraph } from './roomGraph';

const TEST_ROOM_LIST = [
  'Hackney',
  'Tower Hamlets',
  'Ealing',
  'LGBTQ bloc',
  'Trade Union bloc'
];

const { homeserver, access_token, userId, rootRoomId } = process.env;

const client = sdk.createClient({
  baseUrl: homeserver,
  accessToken: access_token,
  userId
});

const start = async () => {
  await client.startClient();

  client.once(ClientEvent.Sync, async (state, prevState, res) => {
    // Initialize the room graph with the root room and TEST_ROOM_LIST
    const roomGraph = await initRoomGraph(rootRoomId, TEST_ROOM_LIST);
    client['room_graph'] = roomGraph; // Add room graph to client for future reference
    console.log('Room Graph:', roomGraph);

    // state will be 'PREPARED' when the client is ready to use
    console.log(state);
  });

  const scriptStart = Date.now();

  // Eventually, create a private-chate-type-room with the bot to handle onboarding

  client.on(
    RoomEvent.Timeline,
    async function (event, room, toStartOfTimeline) {
      const eventTime = event.event.origin_server_ts;
      // console.log('LOGGING ROOM', room);
      console.log(event);

      if (scriptStart > eventTime) {
        return; //don't run commands for old messages
      }

      if (event.event.sender === userId) {
        return; // don't reply to messages sent by the tool
      }

      if (event.event.room_id !== rootRoomId) {
        return; // don't activate unless in the active room
      }
      // Add room graph to event for future reference
      event['room_graph'] = client['room_graph'];

      if (event.getType() === 'm.room.message') handleMessage(event);

      if (event.getType() === 'm.reaction') handleReaction(event);

      if (event.getType() === 'm.room.member') handleMember(event);
    }
  );
};

start();
