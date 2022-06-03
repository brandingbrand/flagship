export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [Key in string | number]?: JsonValue | undefined };
export type JsonArray = JsonValue[];
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;
export type VerifyIsSerializable<T extends JsonValue> = T;
