const { access_token, homeserver, userId } = process.env;

export const createRoom = (
  name: string,
  type: string = 'child',
  invite_users: Array<string> = []
) => {
  let body = {
    creation_content: { 'm.federate': true, type: type },
    invite: invite_users,
    is_direct: false, // Signifies whether the room is a direct chat or not
    name: name,
    visibility: 'private'
  };

  return fetch(`${homeserver}/_matrix/client/v3/createRoom`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    }
  });
};

export const sendEvent = (roomId: string, content: any, type: string) => {
  return fetch(`${homeserver}/_matrix/client/v3/rooms/${roomId}/send/${type}`, {
    method: 'POST',
    body: JSON.stringify(content),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    }
  });
};

export const sendMessage = (roomId: string, message: string, context = {}) => {
  return sendEvent(
    roomId,
    {
      body: message,
      msgtype: 'm.text',
      context
    },
    'm.room.message'
  );
};

export const getEvent = async (roomId: string, eventId: string) => {
  const response = await fetch(
    `${homeserver}/_matrix/client/v3/rooms/${roomId}/event/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );
  return response.json();
};

export const getRoomEvents = (roomId: string) => {
  return fetch(
    `${homeserver}/_matrix/client/v3/rooms/${roomId}/messages?limit=10000&dir=b`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }
  );
};

export const redactEvent = async (
  roomId: string,
  eventId: string,
  redactionReason: string
) => {
  const txn = Date.now();

  return fetch(
    `${homeserver}/_matrix/client/v3/rooms/${roomId}/redact/${eventId}/${txn}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        reason: redactionReason
      }),
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );
};
