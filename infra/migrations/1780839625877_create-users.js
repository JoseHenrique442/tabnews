exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    username: {
      type: "varchar(30)", // Limits in 30 -> References: GitHub.
      notNull: true,
      unique: true,
    },
    // Referência do StackOverflow. Limite de 254, distribuição normal de 23 caracteres para e-mail https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // bcrypt limita em 70 caracteres https://security.stackexchange.com/a/39851
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // Por que sempre usar data com timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
