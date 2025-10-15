import protobuf from 'protobufjs';
import path from 'path';


let userProto: protobuf.Type;
let userListProto: protobuf.Type;


// Initialize Protobuf types from .proto file
export async function initializeProtobuf(): Promise<void> {
  try {
    const protoPath = path.join(__dirname, '../proto/user.proto');
    const root = await protobuf.load(protoPath);
    
    userProto = root.lookupType('User');
    userListProto = root.lookupType('UserList');
  } catch (error) {
    throw error;
  }
}

// Serialize a single user to Protobuf
export function serializeUser(user: any): Uint8Array {
  if (!userProto) {
    throw new Error('Protobuf not initialized. Call initializeProtobuf() first.');
  }

  const errMsg = userProto.verify(user);
  if (errMsg) {
    throw new Error(`Invalid user data: ${errMsg}`);
  }

  const message = userProto.create(user);
  return userProto.encode(message).finish();
}

// Serialize a list of users to Protobuf
export function serializeUserList(users: any[]): Uint8Array {
  if (!userListProto) {
    throw new Error('Protobuf not initialized. Call initializeProtobuf() first.');
  }

  const formattedUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    emailHash: user.emailHash,
    signature: user.signature,
  }));

  const userList = { users: formattedUsers };
  
  const errMsg = userListProto.verify(userList);
  if (errMsg) {
    throw new Error(`Invalid user list data: ${errMsg}`);
  }

  const message = userListProto.create(userList);
  return userListProto.encode(message).finish();
}

// Deserialize Protobuf data to UserList
export function deserializeUserList(buffer: Uint8Array): any {
  if (!userListProto) {
    throw new Error('Protobuf not initialized. Call initializeProtobuf() first.');
  }

  const message = userListProto.decode(buffer);
  return userListProto.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
}
