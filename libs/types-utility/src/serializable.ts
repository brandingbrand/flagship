export type JsonPrimitive = boolean | number | string | null;
export type JsonObject = { [Key in number | string]?: JsonValue | undefined };
export type JsonArray = JsonValue[];
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;
export type VerifyIsSerializable<T extends JsonValue> = T;
