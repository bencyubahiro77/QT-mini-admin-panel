import protobuf from 'protobufjs';

// Define Protobuf schema inline
const userProtoSchema = `
syntax = "proto3";

message User {
  string id = 1;
  string email = 2;
  string role = 3;
  string status = 4;
  string createdAt = 5;
  string emailHash = 6;
  string signature = 7;
}

message UserList {
  repeated User users = 1;
}
`;

let UserListType: protobuf.Type | null = null;

/**
 * Initialize Protobuf schema
 */
export async function initializeProtobuf(): Promise<void> {
  try {
    const root = protobuf.parse(userProtoSchema).root;
    UserListType = root.lookupType('UserList');
  } catch (error) {
    throw error;
  }
}

/**
 * Decode Protobuf buffer to UserList
 */
export function decodeUserList(buffer: Uint8Array): any {
  if (!UserListType) {
    throw new Error('Protobuf not initialized. Call initializeProtobuf() first.');
  }

  try {
    const message = UserListType.decode(buffer);
    const object = UserListType.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true,
    });
    
    return object;
  } catch (error) {
    throw error;
  }
}

/**
 * Decode Protobuf from base64 string
 */
export function decodeUserListFromBase64(base64String: string): any {
  const buffer = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
  return decodeUserList(buffer);
}
