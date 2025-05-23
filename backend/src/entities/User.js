const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      length: 100,
      unique: true,
    },
    email: {
      type: "varchar",
      length: 100,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    avatar: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    bio: {
      type: "text",
      nullable: true,
    },
    joinDate: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    role: {      type: "varchar",
      length: 20,
      default: "user",
    },
    isVerified: {
      type: "boolean",
      default: false,
    },
    verificationToken: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  relations: {
    threads: {
      type: "one-to-many",
      target: "Thread",
      inverseSide: "author",
    },
    posts: {
      type: "one-to-many",
      target: "Post",
      inverseSide: "author",
    },
  },
})
