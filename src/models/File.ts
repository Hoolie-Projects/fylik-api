import { ObjectId } from "mongodb"

export default interface FileModel {
  _id: ObjectId | string,
  name: string,
  size: number,
  type: string,
  path: string,
  expiresIn: Date,
  fromIp: string,
  createdAt: Date
}
